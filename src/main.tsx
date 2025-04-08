import {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router";
import AppLayout from '@/components/Layouts/AppLayout.tsx';
import CandidatesBase from '@/components/Pages/Candidates/CandidatesBase/index.tsx';
import PatientsRegistration from '@/components/Pages/Candidates/CandidatesRegistration/index.tsx';
import CandidatesEdit from '@/components/Pages/Candidates/CandidatesEdit/index.tsx';
import ReportingBase from '@/components/Pages/Reporting/ReportRegistration.tsx';
import ReportMedical from '@/components/Pages/Reporting/ReportMedical.tsx';
import ReportRegistration from '@/components/Pages/Reporting/ReportRegistration.tsx';
import LoginBase from '@/components/Pages/auth/login.tsx';
import ProtectedRoute from '@/components/Common/ProtectedRoute.tsx';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFnsV3'
import useCountry from '@/hooks/useCountry.ts'
import useMedicalTest from '@/hooks/useMedicalTest.ts'
import './index.css'

function App() {
    const {getCountries} = useCountry();
    const {fetchAllTests} = useMedicalTest();

    useEffect(() => {
        getCountries();
        fetchAllTests();
    }, []);

    return (
        <StrictMode>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<LoginBase />}/>
                        <Route element={<ProtectedRoute layout={<AppLayout />} />}>
                            <Route path="patients" element={<CandidatesBase />}/>
                            <Route path="patients/:id" element={<CandidatesEdit />}/>
                            <Route path="patients/register" element={<PatientsRegistration />}/>
                            <Route path="reporting" element={<ReportingBase />}/>
                        </Route>
                        <Route path="report/medical/:id" element={<ReportMedical />}/>
                        <Route path="report/registration/:id" element={<ReportRegistration />}/>
                    </Routes>
                </BrowserRouter>
            </LocalizationProvider>
        </StrictMode>
    )
}

createRoot(document.getElementById('root')!).render(<App/>);