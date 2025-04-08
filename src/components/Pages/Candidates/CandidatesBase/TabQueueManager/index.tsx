import { useState, useEffect } from 'react'
import useQueue from '@/hooks/useQueue';
import QueueCards from '@/components/Pages/Candidates/CandidatesBase/TabQueueManager/QueueCards';
import QueueTable from '@/components/Pages/Candidates/CandidatesBase/TabQueueManager/QueueTable';
import QueueFilter from '@/components/Pages/Candidates/CandidatesBase/TabQueueManager/QueueFilter';

export default function PatientsBase() {
    const [rows, setRows] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchData, setSearchData] = useState({ keyword: "", doctor: "" });
    const [currentData, setCurrentData] = useState<any>({ current: 0, list: [] });

    const { search } = useQueue();

    useEffect(() => {
        setLoading(true);
        search(searchData.keyword, searchData.doctor)
            .then(res => {
                const queueArr = Array.isArray(res) ? res?.map(item => {
                    return {...item, name: `${item?.Candidate?.firstName || ''} ${item?.Candidate?.lastName || ''}`};
                }) : [];
                setRows(queueArr);
                const candidateIdsList: any[] = queueArr.map(itm => itm.Candidate.id);
                let localStorageQueueData: any = localStorage.getItem("queueData");
                localStorageQueueData = JSON.parse(localStorageQueueData);
                const dt = { current: localStorageQueueData?.current ?? candidateIdsList[0], list: candidateIdsList };
                setCurrentData(dt);
                localStorage.setItem("queueData", JSON.stringify(dt))
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    }, [searchData]);

    const columns = ['Token', 'Name', 'Gender', 'Doctor', 'Radiologist', 'Pathologist', 'Physical', 'Blood', 'Lab', 'X-Ray', 'X-Ray Report', 'Blood Report', 'Actions']

    return (
        <>
            <QueueCards />

            <QueueFilter
                currentData={currentData}
                setSearchData={setSearchData}
                setCurrentData={setCurrentData}
            />

            <QueueTable
                rows={rows}
                columns={columns}
                isLoading={loading}
                currentData={currentData}
            />
        </>
    );
}