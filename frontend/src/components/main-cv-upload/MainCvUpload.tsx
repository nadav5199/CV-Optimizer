import { useState, useEffect } from 'react'
import { Button, Typography } from 'antd'
import { mainCvService } from '../../services/api.service'

const { Text } = Typography

export default function MainCvUpload() {
    const [currentUrl, setCurrentUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        mainCvService.get().then(res => {
            setCurrentUrl(res.data?.cvUrl ?? null)
        }).catch(() => {})
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const res = await mainCvService.upload(file)
            setCurrentUrl(res.data.cvUrl)
        } catch {
            // upload failed silently
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Button
                loading={uploading}
                onClick={() => document.getElementById('main-cv-input')?.click()}
            >
                {currentUrl ? 'Replace Main CV' : 'Upload Main CV'}
            </Button>
            <input
                id="main-cv-input"
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {currentUrl && (
                <Text>
                    <a href={`http://localhost:8080${currentUrl}`}>
                        Download Main CV
                    </a>
                </Text>
            )}
        </div>
    )
}
