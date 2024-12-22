import './App.css';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import Application from './components/Employer/Application.jsx';
import EmployerDashboard from './components/Employer/EmployerDashBoard.jsx';
import JobPosting from './components/Employer/JobPosting.jsx';
import JobSeekerDetails from './components/Employer/JobSeekerDetails.jsx';
import CompleteEmpProfile from './components/Employer/Profile/CompleteProfile.jsx';
import UpdateEmpProfile from './components/Employer/Profile/UpdateEmpProfile.jsx';
import CompanyDetails from './components/JobSeeker/CompanyDetails.jsx';
import AppliedJobs from './components/JobSeeker/Jobs/AppliedJobs.jsx';
import AvailableJobs from './components/JobSeeker/Jobs/AvailableJobs.jsx';
import JobDetails from './components/JobSeeker/Jobs/JobDetails.jsx';
import RecommendedJobs from './components/JobSeeker/Jobs/RecommendedJobs.jsx';
import SearchJobs from './components/JobSeeker/Jobs/SearchJobs.jsx';
import JobSeekerDashboard from './components/JobSeeker/JobSeekerDashboard.jsx';
import NotificationJob from './components/JobSeeker/notificationJob.jsx';
import CompleteProfile from './components/JobSeeker/Profile/CompleProfile.jsx';
import UpdateJobSeekerProfile from './components/JobSeeker/Profile/UpdateProfileJS.jsx';
import Footer from './components/Layouts/Footer.jsx';
import HomePageLogin from './components/Layouts/HomePageLogin.jsx';
import HomePageRegister from './components/Layouts/HomePageRegister.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = ()=>{
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePageLogin/>}/>
        <Route path='/register' element={<HomePageRegister/>}/>
        <Route path='/completeJobSeekerProfile/:username' element={<CompleteProfile/>}/>
        <Route path='/updateJobSeekerProfile/:username' element={<UpdateJobSeekerProfile/>} />
        <Route path='/completeEmployerProfile/:username' element={<CompleteEmpProfile/>}/>
        <Route path='/updateEmployerProfile/:username' element={<UpdateEmpProfile/>} />
        <Route path='/jobSeekerDashBoard'  element={<ProtectedRoute> <JobSeekerDashboard/> </ProtectedRoute> }/> 
        <Route path='/employerDashBoard' element={<ProtectedRoute>  <EmployerDashboard/> </ProtectedRoute>}/>
        <Route path='/companyDetails/:id' element={<ProtectedRoute> <CompanyDetails/> </ProtectedRoute>}/>
        <Route path='/jobPost' element ={<ProtectedRoute> <JobPosting/> </ProtectedRoute>} />
        <Route path='/recommendedJobs' element={<ProtectedRoute> <RecommendedJobs/> </ProtectedRoute>} />
        <Route path='/availableJobs' element={<ProtectedRoute> <AvailableJobs/> </ProtectedRoute>} />
        <Route path='/availableJobs/:jobTitle' element={<ProtectedRoute> <SearchJobs/> </ProtectedRoute>} />
        <Route path='/appliedJobs' element={<ProtectedRoute> <AppliedJobs/> </ProtectedRoute>} />
        <Route path='/jobDetails/:id' element={<ProtectedRoute> <JobDetails/> </ProtectedRoute>}/>
        <Route path='/application' element={<ProtectedRoute> <Application/> </ProtectedRoute>}/>
        {/* <Route path='/notifications' element={<ProtectedRoute> <NotificationJob/> </ProtectedRoute>}/> */}
        <Route path='/Application/jobSeeker/:jobseekerId/:applicationId' element={ <ProtectedRoute> <JobSeekerDetails/> </ProtectedRoute> }/>
     </Routes>
     {/* <Footer/> */}
    </div>

    </BrowserRouter>
  );
}

export default App;
