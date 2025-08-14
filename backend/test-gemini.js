const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Инициализация Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function testGeminiWithDocument() {
  try {
    console.log('🧪 Тестирование Gemini API с документом...');
    
    // Используем один из загруженных документов
    const testImagePath = path.join(__dirname, 'uploads', '1755180140970-2025-08-03_14.50.28.jpg');
    
    if (!fs.existsSync(testImagePath)) {
      console.error('❌ Тестовый файл не найден:', testImagePath);
      return;
    }
    
    console.log('📄 Используем файл:', testImagePath);
    
    // Читаем файл
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log('📊 Размер файла:', imageBuffer.length, 'байт');
    console.log('🔄 Отправляем запрос к Gemini API...');
    
    const prompt = `
        Analyze this receipt/invoice image and extract ALL the following information in JSON format:
        {
          "purchaseDate": "YYYY-MM-DD format (Purchase Date)",
          "vendorName": "vendor/business name",
          "vendorAbn": "Australian Business Number if present",
          "vendorAddress": "complete vendor address",
          "documentType": "receipt or invoice",
          "receiptNumber": "receipt or invoice number",
          "paymentType": "cash, card, eftpos, credit, etc",
          "amountExclTax": "amount excluding tax as number",
          "taxAmount": "GST/tax amount as number",
          "totalAmount": "total amount including tax as number",
          "expenseCategory": "category like office supplies, meals, transport, etc",
          "taxStatus": "taxable, tax-free, or mixed"
        }
        
        IMPORTANT: 
        - Return only valid JSON without any additional text
        - If a field cannot be determined, use null
        - Ensure all amounts are numbers, not strings
        - Use Australian date format YYYY-MM-DD
        - Be precise with expense categorization
      `;
    
    const startTime = Date.now();
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      },
      { text: prompt }
    ]);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('⏱️ Время выполнения:', duration, 'мс');
    console.log('✅ Ответ получен от Gemini API');
    
    const response = await result.response;
    const text = response.text();
    
    console.log('📝 Сырой ответ от Gemini:');
    console.log('---');
    console.log(text);
    console.log('---');
    
    // Попытка парсинга JSON
    try {
      // Извлекаем JSON из ответа (может быть обернут в markdown)
      let jsonText = text;
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      
      const parsedData = JSON.parse(jsonText);
      
      console.log('✅ JSON успешно распарсен:');
      console.log(JSON.stringify(parsedData, null, 2));
      
      // Проверяем наличие обязательных полей
      const requiredFields = ['purchaseDate', 'vendorName', 'documentType', 'totalAmount', 'taxAmount'];
      const missingFields = requiredFields.filter(field => !parsedData.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        console.error('❌ Отсутствуют обязательные поля:', missingFields);
        process.exit(1);
      }
      
      console.log('✅ Все обязательные поля присутствуют');
      console.log('📊 Извлеченные данные:');
      console.log(`   - Дата покупки: ${parsedData.purchaseDate}`);
      console.log(`   - Поставщик: ${parsedData.vendorName}`);
      console.log(`   - ABN: ${parsedData.vendorAbn || 'не указан'}`);
      console.log(`   - Адрес: ${parsedData.vendorAddress || 'не указан'}`);
      console.log(`   - Тип документа: ${parsedData.documentType}`);
      console.log(`   - Номер документа: ${parsedData.receiptNumber || 'не указан'}`);
      console.log(`   - Способ оплаты: ${parsedData.paymentType || 'не указан'}`);
      console.log(`   - Сумма без налога: $${parsedData.amountExclTax || 0}`);
      console.log(`   - Налог (GST): $${parsedData.taxAmount || 0}`);
      console.log(`   - Общая сумма: $${parsedData.totalAmount || 0}`);
      console.log(`   - Категория расходов: ${parsedData.expenseCategory || 'не определена'}`);
      console.log(`   - Налоговый статус: ${parsedData.taxStatus || 'не определен'}`);
      
      console.log('🎉 Тест успешно завершен!');
      
    } catch (parseError) {
      console.error('❌ Ошибка парсинга JSON:', parseError.message);
      console.log('🔍 Попробуем найти JSON в ответе...');
      
      // Попытка найти JSON различными способами
      const patterns = [
        /\{[\s\S]*\}/,
        /```json\s*([\s\S]*?)\s*```/,
        /```\s*([\s\S]*?)\s*```/
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          try {
            const extractedJson = match[1] || match[0];
            const parsed = JSON.parse(extractedJson);
            console.log('✅ JSON найден и распарсен:', JSON.stringify(parsed, null, 2));
            break;
          } catch (e) {
            continue;
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании Gemini API:');
    console.error('Сообщение:', error.message);
    console.error('Статус:', error.status);
    console.error('Детали:', error.statusText);
    
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    
    // Проверяем тип ошибки
    if (error.message.includes('503') || error.message.includes('overloaded')) {
      console.log('💡 Рекомендация: API перегружен, попробуйте позже');
    } else if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
      console.log('💡 Рекомендация: Проверьте API ключ');
    } else if (error.message.includes('400')) {
      console.log('💡 Рекомендация: Проверьте формат запроса');
    }
  }
}

// Запускаем тест
testGeminiWithDocument();