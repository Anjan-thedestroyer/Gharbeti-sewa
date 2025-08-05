import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from './MainWeb'
import Gharbeti from './component/Gharbeti'
import Login from './component/Login'
import Register from './component/Register'
import UnVerified from './component/UnVerified'
import Verify from './component/Verify'
import Buyer from './Buyer'
import ClientApply from './component/ClientApply'
import HostelList from './component/HostelList'
import MyWorks from './MyWorks'
import EditDetails from './component/EditDetails'
import EditImage from './component/EditImage'
import VerifyEmail from './component/Verify_user'
import AllBuyer from './component/AllBuyer'
import Privacy from './component/privacy'
import Terms from './component/Terms'
import OtpVerification from './component/OtpVerification'
import ResetPassword from './component/ResetPassword'
import ForgotPassword from './component/ForgotPassword'
import ListFreelancer from './component/ListFreelancer'
import TaskReq from './component/TaskReq'
import AccWork from './component/AccWork'

const App = () => {



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gharbeti" element={<Gharbeti />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/unverified' element={<UnVerified />} />
        <Route path='/verify/:id/:taskId' element={<Verify />} />
        <Route path='/verify/:id' element={<Verify />} />

        <Route path='/bhada/:id' element={<Buyer />} />
        <Route path='/apply/:id' element={<ClientApply />} />
        <Route path='/hostel' element={<HostelList />} />
        <Route path='/control-hostel' element={<MyWorks />} />
        <Route path='/edit-details/:id' element={<EditDetails />} />
        <Route path='/edit-image/:id' element={<EditImage />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/list-buyer' element={<AllBuyer />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verification-otp' element={<OtpVerification />} />
        <Route path='/list-freelancer' element={<ListFreelancer />} />
        <Route path='/accepted-work' element={<AccWork />} />
        <Route path='/task-req' element={<TaskReq />} />
      </Routes>
    </Router>
  )
}

export default App
