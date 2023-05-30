import React, { useEffect, useState } from 'react'
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';



import { Card } from 'primereact/card';

import './Home.css'
import axios from 'axios';
import { BASE_API_URL } from '../config';


const itemTemplate = (employee) => {
    return (
        <Card className='row-item' title={employee.firstName}>
            <p className="m-0">
                {employee.employeeId} - {employee.firstName} {employee.lastName}
            </p>
        </Card>
    )
}



const Home = () => {
    const initName = {
        firstName: '',
        lastName: ''
    }
    const [employees, setEmployees] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [name, setName] = useState(initName);
    const [addButtonIcon, setaddButtonIcon] = useState('pi pi-plus');

    useEffect(() => {
        let apiUrl = BASE_API_URL + '/api/GetEmployee'
        axios.get(apiUrl).then(r => setEmployees(r.data));
    }, []);

    const toggleForm = () => {
        changeIcons()
        setIsAdd(prev => !prev)
    }

    const saveEmployee = () => {
        let apiUrl = BASE_API_URL + '/api/SaveEmployee';
        let arr = [];
        arr.push(name);
        axios.post(apiUrl, arr).then(r => {
            setEmployees(r.data)
            changeIcons();
            setIsAdd(false);
        });
    }

    const changeIcons = () => {
        if (!isAdd) {
            setaddButtonIcon("pi pi-minus")
        }
        else {
            setaddButtonIcon("pi pi-plus")
        }
    }

    return (
        <div>
            <Button icon={addButtonIcon} size="small" rounded className='mb-2' onClick={toggleForm} />
            {isAdd && <div className='row-form'>
                <span className="p-float-label px-1">
                    <InputText id="txtFirstName" value={name.firstName} onChange={(e) => setName(prev => {
                        return {
                            ...prev, firstName: e.target.value
                        }
                    })} />
                    <label htmlFor="txtFirstName">First Name</label>
                </span>
                <span className="p-float-label px-1">
                    <InputText id="txtLastName" value={name.lastName} onChange={(e) => setName(prev => {
                        return {
                            ...prev, lastName: e.target.value
                        }
                    })} />
                    <label htmlFor="txtLastName">Last Name</label>
                </span>
                <Button label="Save" icon="pi pi-check" iconPos="right" className='mb-2' onClick={saveEmployee} />
            </div>}
            <DataView value={employees} itemTemplate={itemTemplate} paginator rows={3} />
        </div>
    )
}

export default Home
