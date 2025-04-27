import { GetAppointmentsByInsuredId } from '../src/application/usecases/GetAppointmentsByInsuredId';
import { Appointment } from '../src/domain/entities/Appointment';

const mockRepository = {
    savePending: jest.fn(),
    updateStatusToCompleted: jest.fn(),
    findByInsuredId: jest.fn()
};

describe('GetAppointmentsByInsuredId Use Case', () => {
    it('debe retornar lista de appointments', async () => {
        const appointment: Appointment = new Appointment({
            insuredId: '01234',
            scheduleId: 101,
            countryISO: 'PE',
            status: 'pending',
            createdAt: new Date().toISOString()
        });

        mockRepository.findByInsuredId.mockResolvedValue([appointment]);

        const useCase = new GetAppointmentsByInsuredId(mockRepository);
        const result = await useCase.execute('01234');

        expect(result.length).toBe(1);
        expect(result[0].insuredId).toBe('01234');
    });

    it('debe lanzar error si el insuredId es inválido', async () => {
        const useCase = new GetAppointmentsByInsuredId(mockRepository);

        await expect(() => useCase.execute('123')).rejects.toThrow('El insuredId debe tener exactamente 5 dígitos');
    });
});
