import MedicalTestService from '@/api/medicalTest.ts';
import useGlobalStore from '@/store/useGlobalStore.ts';

export default function useMedicalTest() {
    const setAllTests = useGlobalStore((state: any) => state.setAllTests);

    const fetchAllTests = async () => {
        const response = await MedicalTestService.getAllTests();
        if (!response) return null;
        setAllTests(response);
        return response;
    }

    const fetchUpdatedResults = async (id: any) => {
        const response = await MedicalTestService.getUpdatedResults(id)
        if (!response) return null;
        return response;
    }

    const editUpdatedResults = async (data: any) => {
        const response = await MedicalTestService.postUpdatedResults(data)
        if (!response) return null;
        return response;
    }

    const editUpdatedEvaluationGroupResults = async (data: any) => {
        const response = await MedicalTestService.postUpdatedEvaluationGroupResults(data)
        if (!response) return null;
        return response;
    }

    // const editStepper = async (data: any) => {
    //     const response = await MedicalTestService.updateStepper(data)
    //     if (!response) return null;
    //     return response;
    // }

    const prepTestResults = (tests:any,results:any) => {
        const data: any[] = [];

        tests?.forEach((eg:any) => {
            const temp = {...eg};
            const i = results?.evaluationGroupResults?.find((egr:any) => egr.evaluationGroupId === eg.id);

            if (i) {
                temp._value = i;
            }

            if (eg?.TestTypes.length > 0) {
                let ttypes = [];

                eg?.TestTypes.map((tt:any) => {
                    ttypes.push(tt);

                    if (tt?.TestTypeFields.length > 0) {

                        let ttftypes = [];
                        tt?.TestTypeFields.map((ttf:any) => {
                            const j = results?.testTypeFieldResults?.find((ttfr:any) => ttfr.testTypeFieldId === ttf.id);
                            if (j) {
                                ttf._value = j;
                            }
                            ttftypes.push(ttf);
                        })
                    }
                })

            }
            data.push(temp);
        })

        return data;
    }

    return {
        fetchAllTests,
        fetchUpdatedResults,
        editUpdatedResults,
        editUpdatedEvaluationGroupResults,
        prepTestResults,
        // editStepper
    }
}