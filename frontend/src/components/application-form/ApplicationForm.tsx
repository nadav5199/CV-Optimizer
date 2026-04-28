import { useState } from "react"
import { Modal, Form, Input, Button, Space } from "antd"
import { applicationService } from '../../services/api.service'
import type { ApplicationData } from '../../types/application.types'

interface ApplicationFormProps {
    onClose: () => void
    isOpen: boolean
    onAdd: (item: ApplicationData) => void
}
export default function ApplicationForm({onClose, isOpen, onAdd}: ApplicationFormProps){
    const [companyName, setCompanyName] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('companyName', companyName)
            formData.append('description', description)
            formData.append('title', title)
            const response = await applicationService.submit(formData);
            onAdd(response.data);
            setCompanyName('');
            setDescription('');
            setTitle('');
            onClose()
        } catch (error) {
            console.error('Submit failed:', error);
        }
    }

    return (
        <Modal 
            title="Add Submission" 
            open={isOpen} 
            onCancel={onClose}
            footer={null}
        >
            <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item label="Company Name">
                    <Input 
                        placeholder="Company name" 
                        value={companyName} 
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Job Description">
                    <Input 
                        placeholder="Job description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Job Title">
                    <Input 
                        placeholder="Job title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button onClick={onClose}>Close</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}
