import Link from 'next/link'

export default function Footer() {
  return (
<footer className="mt-12 bg-gray-50 dark:bg-gray-900">
      <div className="border-t border-gray-200 dark:border-gray-700" />
      
      {/* Секция ссылок */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        {/*
          Для вертикального расположения ссылок мы добавили класс "block" к каждому элементу <a>, 
          чтобы они занимали всю доступную ширину и принудительно переносились на новую строку.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">Company</h4>
            <a href="/terms" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms & Conditions</a>
            <a href="/privacy" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Policy</a>
          </div>
          
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">Resources</h4>
            <a href="/pricing" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Pricing</a>
            <a href="/about" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">About Us</a>
          </div>
          
          <div className="flex flex-col space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">Support</h4>
            <a href="/contact" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact Us</a>
          </div>
        </div>
      </div>
      
      {/* Секция копирайта */}
      <div className="border-t border-gray-200 dark:border-gray-700" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          TRAKYTT Validation Portal 2025/ <br className="sm:hidden"/> Early Access Version - Developed by 3030 Technologies &copy; 2025 For testing and evaluation only
        </p>
      </div>
    </footer>
  )
}

