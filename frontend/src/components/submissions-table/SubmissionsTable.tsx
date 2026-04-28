import { useEffect } from "react";
import type { ApplicationData } from "../../types/application.types";
import { applicationService } from '../../services/api.service';
import styles from './SubmissionsTable.module.scss'

interface SubmissionsTableProps {
    submissions: ApplicationData[]
    setSubmissions: React.Dispatch<React.SetStateAction<ApplicationData[]>>
}

export default function SubmissionsTable({ submissions, setSubmissions }: SubmissionsTableProps) {
    useEffect(()=>{
        const fetchSubmissions = async () => {
            try{
                const response = await applicationService.getAll()
                setSubmissions(response.data)
            }catch(error){
                console.error('Failed')
            }
        }
        fetchSubmissions()
    },[])

    const handleDelete = async (id: string) => {
        await applicationService.delete(id)
        setSubmissions(prev => prev.filter(s => s._id !== id))
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {submissions.map((submission, index) => (
                    <tr key={index}>
                        <td>{submission.companyName}</td>
                        <td>{submission.title}</td>
                        <td>{submission.description}</td>
                        <td>{new Date(submission.date!).toDateString()}</td>
                        <td>
                            <button onClick={() => handleDelete(submission._id)}>X</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
