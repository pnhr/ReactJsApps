import React, { useEffect, useState, useRef } from 'react'
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';

import './Home.css'
import axios from 'axios';
import { BASE_API_URL } from '../config';


const ItemTemplate = (employee) => {
    const [isExp, setIsExp] = useState(false)
    const [display, setDisplay] = useState('hidden')
    const itemRef = useRef(null)
    useEffect(() => {
        if (isExp)
            setDisplay('visible')
        else
            setDisplay('hidden')
    }, [isExp]);

    const deleteItem = (e, empid) => {
        let apiUrl = BASE_API_URL + '/api/DeleteEmployee?empId=' + empid;
        e.stopPropagation();
        axios.delete(apiUrl).then(r => {
            window.location.reload(false);
        })
    }

    return (
        <div ref={itemRef} className='emp' onClick={() => setIsExp(prev => !prev)}>
            <div className='emp-cord'>
                <Avatar image={employee.imagePath} size="xlarge" style={{ backgroundColor: '#ffffff' }} />
                <div className='emp-data-container'>
                    <span className='emp-name'>{employee.firstName}{" "}{employee.lastName}</span>
                    <span className='emp-details'>
                        Id : {employee.employeeId}; First Name : {employee.firstName}; Last Name : {employee.lastName}
                    </span>
                </div>
                <div className='delete-item'>
                    <i className="pi pi-trash" style={{ color: '#FFFFFF' }} onClick={e => deleteItem(e, employee.employeeId)}></i>
                </div>
            </div>
            <div className={'emp-exp-details' + ' ' + display}>
                <p>{employee.discription}</p>
            </div>
        </div>
    )
}



const Home = () => {
    const initName = {
        firstName: '',
        lastName: '',
        discription: ''
    }
    const toast = useRef(null);
    const [employees, setEmployees] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState(initName);
    const [addButtonIcon, setaddButtonIcon] = useState('pi pi-plus');

    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = () => {
        let apiUrl = BASE_API_URL + '/api/GetEmployee'
        axios.get(apiUrl).then(r => setEmployees(r.data));
    }

    const toggleForm = () => {
        changeIcons()
        setIsAdd(prev => !prev)
    }

    const saveEmployee = () => {
        setIsSaving(true);
        let apiUrl = BASE_API_URL + '/api/SaveEmployee';
        axios.post(apiUrl, name).then(r => {
            getEmployees();
            setIsSaving(false);
            changeIcons();
            setIsAdd(false);
            showSuccess();
        }).catch(err => {
            showError();
        });
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Data have been successfully saved!', life: 3000 });
    }

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong!', life: 3000 });
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
            <Toast ref={toast} />
            <div className='add-item-btn'>
                <Button icon={addButtonIcon} size="small" rounded className='mb-2' onClick={toggleForm} />
            </div>
            {isAdd && <div className='row-form'>
                <span className="p-float-label px-1">
                    <InputText type="text" id="txtFirstName" className="p-inputtext-sm" value={name.firstName} onChange={(e) => setName(prev => {
                        return {
                            ...prev, firstName: e.target.value
                        }
                    })} />
                    <label htmlFor="txtFirstName">First Name</label>
                </span>
                <span className="p-float-label px-1">
                    <InputText type="text" id="txtLastName" className="p-inputtext-sm" value={name.lastName} onChange={(e) => setName(prev => {
                        return {
                            ...prev, lastName: e.target.value
                        }
                    })} />
                    <label htmlFor="txtLastName">Last Name</label>
                </span>
                <span className="p-float-label px-1 w-100">
                    <InputText type="text" id="txtDescription" className="p-inputtext-sm w-100" value={name.discription} onChange={(e) => setName(prev => {
                        return {
                            ...prev, discription: e.target.value
                        }
                    })} />
                    <label htmlFor="txtDescription">Description</label>
                </span>
                <Button label={isSaving ? "Savings.." : "Save"} icon={!isSaving ? "pi pi-check" : ""} iconPos="right" className='mb-2' size="small" onClick={saveEmployee} />
            </div>}
            <DataView value={employees} itemTemplate={ItemTemplate} paginator rows={3} />
        </div>
    )
}

export default Home
