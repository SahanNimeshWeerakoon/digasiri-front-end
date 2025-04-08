export interface ICandidate {
    id: number|undefined,
    appointmentId: number|undefined,
    firstName: string
    lastName: string
    dateOfBirth: Date | undefined | null,
    nationality: string,
    gender: string,
    passportNumber: string,
    slipNumber: number,
    phone: string,
    email: string,
    photoPath: string,
    fingerPrintPath: string[],
    profession: string,
    travellingTo: string,
    maritalStatus: string,
    passportIssueDate: Date | undefined | null,
    passportIssuePlace: string,
    passportExpDate: Date | undefined | null,
    visaType: string,
    agencyName: string,
    agencyNumber: number,
    gamcaNumber: string,
    nic: string,
    positionAppliedFor: string,
    vaccination: string,
    other: string,
    createdBy: number,
    updatedBy: number,
    queueId: number,
    createdAt: Date | undefined | null,
    updatedAt: Date | undefined | null,
    appointmentDate: Date | undefined | null,
    visitedDate: Date | undefined | null,
}

export interface IPatientSearchResult extends ICandidate {
    Appointments: [
        {
            date: Date | null | undefined,
            visitedDate: Date | null | undefined,
        }
    ]
}

export interface ITestCriteria {
    id: number;
    testTypeFieldId: number;
    name: string;
    avgLowMargin: number;
    avgHighMargin: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITestTypeField {
    id: number;
    testTypeFieldName: string;
    testTypeId: number;
    unit: string | null,
    inputType: string | null,
    radioOptions: string[] | null,
    createdAt: Date;
    updatedAt: Date;
    TestCriteria: ITestCriteria[];
    _value: any
}

export interface ITestType {
    id: number;
    testName: string;
    tabName: string;
    testDescription: string;
    needReview: true,
    createdAt: Date;
    updatedAt: Date;
    appointmentTestId: number;
    EvaluationGroupTestTypes: {
        createdAt: Date;
        updatedAt: Date;
        evaluationGroupId:number;
        testTypeId: number;
    },
    TestTypeFields: ITestTypeField[];
}

export interface IEvaluationGroup {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    TestTypes: ITestType[];
    _value?: any;
}

export interface IPatientsStats {
    total_candidates: string;
    candidates_in_0_to_14_days: string;
    candidates_in_14_to_16_days: string;
    candidates_in_16_to_20_days: string;
    candidates_more_than_20_days: string;
}

export interface ILoginRequest {
    username: string;
    password: string;
}

export interface IUpdateResults {
    username: string;
    password: string;
}

export interface IEvaluationGroupResults {
    id: number;
    appointmentId: number;
    evaluationGroupId: number;
    result: string;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITestTypeFieldResults {
    id: number;
    appointmentId: number;
    testTypeFieldId: number;
    result: string;
    file: string;
    time: Date;
    comments: string;
    reviewedBy: string | null,
    reviewedComment: string | null,
    createdAt: Date;
    updatedAt: Date;
}

export interface IManagerRemark {
    statue: string | null,
    remark: string | null,
    doctor: number | null,
}

export interface IUpdatedResults {
    evaluationGroupResults: IEvaluationGroupResults[];
    testTypeFieldResults: ITestTypeFieldResults[];
    managerRemark: IManagerRemark;
}

export interface CashFlowTableRow {
    total: string,
    country: string,
    refunds: string,
    withMMR: string,
    profits: string,
    withoutMMR: string,
    candidates: string,
    totalRefunds: string,
    refundsWithoutMMR: string,
}

export interface IUpdatedResults {
    appointmentId: number,
    testTypeFieldId: number,
    result?: string,
    file?: string,
    comments?: string
}

export interface IUpdatedEvaluationGroupResults {
    appointmentId: number,
    evaluationGroupId: number,
    result?: string,
    remarks?: string,
}

export interface CountryType {
    code: string;
    label: string;
    phone: string;
    suggested?: boolean;
}