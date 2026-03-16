import { useEffect, useState } from "react";
import type { ApplicationData } from "../../types/application.types";
import { applicationService } from '../../services/api.service';
import styles from './SubmissionsTable.module.scss'

export default function SubmissionsTable() {
    const [submissions, setSubmissions] = useState<ApplicationData[]>([])
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
        }
    ,[])

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
                    </tr>
                ))}
            </tbody>
        </table>
    );
}