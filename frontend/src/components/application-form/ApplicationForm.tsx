import { useEffect, useRef, useState } from "react"
import { applicationService } from '../../services/api.service'
import type { ApplicationData } from '../../types/application.types'
import styles from './ApplicationForm.module.scss'
interface ApplicationFormProps {
    onClose: () => void 
    isOpen: boolean
}
export default function ApplicationForm({onClose, isOpen}: ApplicationFormProps){
    const [companyName, setCompanyName] = useState('')
    const [description, setDescription] = useState('')
    const [title, setTitle] = useState('')
    useEffect(()=>{
        if(isOpen){
            ref.current?.showModal()
        }else{
            ref.current?.close()
        }
    },[isOpen])
    const ref = useRef<HTMLDialogElement>(null)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('companyName', companyName)
            formData.append('description', description)
            formData.append('title', title)
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
        <dialog ref={ref} onClose={onClose}> 
            <form method="dialog" onSubmit={handleSubmit} className={styles.formContainer}>
                <input type="text" name="company" placeholder="company name" value={companyName} onChange={(e) => onNameChange(e.target.value)}/>
                <input type="text" name="description" placeholder="job description" value={description} onChange={(e) => onDescriptionChange(e.target.value)}/>
                <input type="text" name="title" placeholder="job title" value={title} onChange={(e) => onTitleChange(e.target.value)}/>
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </dialog>
    )
}
