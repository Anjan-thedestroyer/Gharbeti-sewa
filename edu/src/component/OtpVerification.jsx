import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'

const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [location, navigate])

    const validValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otp = data.join("")

        try {
            const response = await axiosInstance.put('/user/verify-forgot-password-otp', {
                email: location.state.email,
                otp: otp
            })

            if (response.data.success) {
                setData(["", "", "", "", "", ""])
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                })
            }

        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <section className=''>
            <div className=''>
                <p className=''>Enter OTP</p>
                <form className='' onSubmit={handleSubmit}>
                    <div className=''>
                        <label htmlFor='otp'>Enter Your OTP :</label>
                        <div className='flex gap-2'>
                            {
                                data.map((element, index) => (
                                    <input
                                        key={"otp" + index}
                                        type='text'
                                        id={`otp-${index}`}
                                        ref={(ref) => {
                                            inputRef.current[index] = ref
                                        }}
                                        value={data[index]}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (!/^\d?$/.test(value)) return

                                            const newData = [...data]
                                            newData[index] = value
                                            setData(newData)

                                            if (value && index < 5) {
                                                inputRef.current[index + 1].focus()
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace" && !data[index] && index > 0) {
                                                inputRef.current[index - 1].focus()
                                            }
                                        }}
                                        maxLength={1}
                                        className='border border-gray-300 text-center w-10 h-10 rounded'
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <button disabled={!validValue} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Verify OTP
                    </button>
                </form>
            </div>
        </section>
    )
}

export default OtpVerification
