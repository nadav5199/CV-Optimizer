import { useState } from "react"
import { applicationService } from '../services/api.service'
import type { ApplicationData } from '../types/application.types'

export default function ApplicationForm(){
    const [companyName, setCompanyName] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData: ApplicationData = { companyName, description, title };
            const response = await applicationService.submit(formData);
            console.log('Success:', response.data);
            setCompanyName('');
            setDescription('');
            setTitle('');
        } catch (error) {
            console.error('Submit failed:', error);
        }
    }
    const onNameChange = (name: string) => {
        setCompanyName(name)
    }
    const onDescriptionChange = (desc: string) => {
        setDescription(desc)
    }
    const onTitleChange = (jobTitle: string) => {
        setTitle(jobTitle)
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="company" placeholder="company name" value={companyName} onChange={(e) => onNameChange(e.target.value)}/>
            <input type="text" name="description" placeholder="job description" value={description} onChange={(e) => onDescriptionChange(e.target.value)}/>
            <input type="text" name="title" placeholder="job title" value={title} onChange={(e) => onTitleChange(e.target.value)}/>
            <button type="submit">Submit</button>
        </form>
    )
}
