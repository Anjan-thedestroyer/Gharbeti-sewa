import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'


const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const validValue = Object.values(data).every(el => el)


    useEffect(() => {
        const email = location?.state?.email
        const isVerified = location?.state?.data?.success
        if (!email || !isVerified) {
            navigate("/")
        } else {
            setData(prev => ({
                ...prev,
                email
            }))
        }
    }, [location, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.")
            return
        }

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New password and confirm password must be the same.")
            return
        }

        try {
            const response = await axiosInstance.put('/user/reset-password', data)

            if (response.data.success) {
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="reset-password-wrapper">
            <div className="reset-password-container">
                <p className="reset-password-heading">Enter Your Password</p>
                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <div className="reset-password-form-group">
                        <label htmlFor='newPassword' className="reset-password-label">New Password :</label>
                        <div className="reset-password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id='newPassword'
                                className="reset-password-input"
                                name='newPassword'
                                value={data.newPassword}
                                onChange={handleChange}
                                placeholder='Enter your new password'
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="reset-password-toggle"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="reset-password-form-group">
                        <label htmlFor='confirmPassword' className="reset-password-label">Confirm Password :</label>
                        <div className="reset-password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id='confirmPassword'
                                className="reset-password-input"
                                name='confirmPassword'
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder='Enter your confirm password'
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="reset-password-toggle"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!validValue}
                        className="reset-password-submit"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </section>

    )
}

export default ResetPassword
