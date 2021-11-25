import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Input, Button } from 'components'
import './Register.css'


const Register = () => {
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        name === 'id' ? setId(value) : setPassword(value)
        console.log(name, value)
    }

    const handleRegister = () => {
        if(JSON.parse(sessionStorage.getItem('user'))){
            //사용자 정보가 있으면 로그인 페이지로 이동하기
            navigate('./login')   
        } else {
            if(id !== '' && password !== '') {
                sessionStorage.setItem('user', JSON.stringify( { id, password}))
                navigate('/home')
                
            } else {
                alert('you need to give right user info.')
            } 
        }
    }
    return (
        <div className='register-container'>
            <Input name='id' type='text' placeholder='Type ID ...' value={id} onChange={handleChange}/><br/>
            <Input name='password' type='password' placeholder='Type PASSWORD ...' value={password} onChange={handleChange}/>
            <Button handleClick={handleRegister}>Register</Button>
        </div>
    )
}

export default Register