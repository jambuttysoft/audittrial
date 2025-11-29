import { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export default function Page() {
    return (
        <Suspense fallback={<div className="auth-container"><div className="auth-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}><div style={{ maxWidth: '400px', width: '100%', padding: '40px' }}><div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '30px', color: '#09090b' }}>TRAKYTT</div><div className="form-header"><h2>Reset Your Password</h2><p>Loading...</p></div></div></div></div>}>
            <ResetPasswordClient />
        </Suspense>
    )
}
