import { useEffect } from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ApplicationData } from "../../types/application.types";
import { applicationService } from '../../services/api.service';

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

    const columns: ColumnsType<ApplicationData> = [
        { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toDateString() },
        { 
            title: 'Action', 
            key: 'action', 
            render: (_, record) => (
                <Button danger onClick={() => handleDelete(record._id)}>X</Button>
            )
        }
    ];

    return (
        <Table columns={columns} dataSource={submissions} rowKey="_id" />
    );
}
