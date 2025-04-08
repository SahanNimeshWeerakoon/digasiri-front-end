import AppointmentService from '@/api/appointment.ts';

export default function useAppointment() {
    const editManagerApproval = async (data:any) => {
        const response = await AppointmentService.updateManagerApproval(data)
        if (!response) return null;
        return response;
    }

    const editRefund = async (data:any) => {
        const response = await AppointmentService.updateRefund(data)
        if (!response) return null;
        return response;
    }

    return {
        editManagerApproval,
        editRefund
    }
}