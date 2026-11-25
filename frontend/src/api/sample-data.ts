import type {
  CreateRegistrationPayload,
  GetRegistrationsParams,
  PagedRegistrationsResponse,
  PaymentStatus,
  Registration,
  RegistrationSummary,
  RegistrationType,
  UpdateRegistrationPayload,
} from './types';

function computePaymentStatus(amountPaid: number, fee: number): PaymentStatus {
  if (amountPaid <= 0) return 'Unpaid';
  if (amountPaid >= fee) return 'Paid';
  return 'Partial';
}

function getFeeForType(type: RegistrationType): number {
  switch (type) {
    case 'Exhibitor':
      return 1500;
    case 'Competitor':
      return 2500;
    case 'VIP':
      return 5000;
  }
}

const initialSampleRegistrations: Registration[] = [
  {
    id: '11111111-1111-4111-8111-000000000001',
    registrationNumber: 'CS27-0001',
    registrationDate: '2027-02-10T08:30:00Z',
    participantName: 'Juan Dela Cruz',
    contactNumber: '09171234567',
    email: 'juan.delacruz@example.com',
    address: '123 Rizal St., Sorsogon City',
    carMakeModel: 'Toyota Supra MK4',
    plateNumber: 'ABC 1234',
    registrationType: 'Competitor',
    status: 'Confirmed',
    registrationFee: 2500,
    amountPaid: 1000,
    paymentStatus: 'Partial',
  },
  {
    id: '11111111-1111-4111-8111-000000000002',
    registrationNumber: 'CS27-0002',
    registrationDate: '2027-02-10T09:15:00Z',
    participantName: 'Maria Clara Santos',
    contactNumber: '09182345678',
    email: 'maria.santos@example.com',
    address: '45 Magsaysay Ave., Naga City',
    carMakeModel: 'Mazda RX-7 FD3S',
    plateNumber: 'NCS 4521',
    registrationType: 'VIP',
    status: 'CheckedIn',
    registrationFee: 5000,
    amountPaid: 5000,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000003',
    registrationNumber: 'CS27-0003',
    registrationDate: '2027-02-10T10:05:00Z',
    participantName: 'Rafael Mendoza',
    contactNumber: '09193456789',
    email: 'rafael.m@example.com',
    address: '78 Bonifacio St., Legazpi City',
    carMakeModel: 'Honda Civic Type R EK9',
    plateNumber: 'EAB 7890',
    registrationType: 'Exhibitor',
    status: 'Confirmed',
    registrationFee: 1500,
    amountPaid: 1500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000004',
    registrationNumber: 'CS27-0004',
    registrationDate: '2027-02-11T08:45:00Z',
    participantName: 'Carlo Villanueva',
    contactNumber: '09204567890',
    email: 'carlo.v@example.com',
    address: '12 Quezon Blvd., Sorsogon City',
    carMakeModel: 'Nissan Skyline GT-R R34',
    plateNumber: 'GTR 3401',
    registrationType: 'VIP',
    status: 'CheckedIn',
    registrationFee: 5000,
    amountPaid: 5000,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000005',
    registrationNumber: 'CS27-0005',
    registrationDate: '2027-02-11T11:20:00Z',
    participantName: 'Andrea Reyes',
    contactNumber: '09215678901',
    email: 'andrea.reyes@example.com',
    address: '90 Peñafrancia Ave., Naga City',
    carMakeModel: 'Subaru WRX STI',
    plateNumber: 'SUB 2219',
    registrationType: 'Competitor',
    status: 'Pending',
    registrationFee: 2500,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000006',
    registrationNumber: 'CS27-0006',
    registrationDate: '2027-02-11T13:40:00Z',
    participantName: 'Mark Anthony Bautista',
    contactNumber: '09226789012',
    email: 'mark.bautista@example.com',
    address: '33 Maharlika Hwy., Bulan, Sorsogon',
    carMakeModel: 'Mitsubishi Lancer Evo IX',
    plateNumber: 'EVO 9001',
    registrationType: 'Competitor',
    status: 'Confirmed',
    registrationFee: 2500,
    amountPaid: 2500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000007',
    registrationNumber: 'CS27-0007',
    registrationDate: '2027-02-12T09:00:00Z',
    participantName: 'Paolo Navarro',
    contactNumber: '09237890123',
    email: 'paolo.navarro@example.com',
    address: '54 Burgos St., Irosin, Sorsogon',
    carMakeModel: 'Toyota GR86',
    plateNumber: 'GR8 6123',
    registrationType: 'Exhibitor',
    status: 'CheckedIn',
    registrationFee: 1500,
    amountPaid: 1500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000008',
    registrationNumber: 'CS27-0008',
    registrationDate: '2027-02-12T10:30:00Z',
    participantName: 'Bianca Mercado',
    contactNumber: '09248901234',
    email: 'bianca.m@example.com',
    address: '101 Mabini St., Legazpi City',
    carMakeModel: 'Porsche 911 Carrera',
    plateNumber: 'POR 9112',
    registrationType: 'VIP',
    status: 'Confirmed',
    registrationFee: 5000,
    amountPaid: 2500,
    paymentStatus: 'Partial',
  },
  {
    id: '11111111-1111-4111-8111-000000000009',
    registrationNumber: 'CS27-0009',
    registrationDate: '2027-02-12T14:15:00Z',
    participantName: 'Jericho Lim',
    contactNumber: '09259012345',
    email: 'jericho.lim@example.com',
    address: '220 Divisoria Rd., Tabaco City',
    carMakeModel: 'Ford Mustang GT',
    plateNumber: 'MUS 5000',
    registrationType: 'Competitor',
    status: 'Cancelled',
    registrationFee: 2500,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000010',
    registrationNumber: 'CS27-0010',
    registrationDate: '2027-02-13T08:10:00Z',
    participantName: 'Kristine Joy Aquino',
    contactNumber: '09260123456',
    email: 'kristine.aquino@example.com',
    address: '15 Roxas Ave., Sorsogon City',
    carMakeModel: 'Honda S2000 AP2',
    plateNumber: 'S2K 2009',
    registrationType: 'Exhibitor',
    status: 'Confirmed',
    registrationFee: 1500,
    amountPaid: 1500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000011',
    registrationNumber: 'CS27-0011',
    registrationDate: '2027-02-13T11:50:00Z',
    participantName: 'Gabriel Torres',
    contactNumber: '09271234568',
    email: 'gabriel.t@example.com',
    address: '88 Luna St., Gubat, Sorsogon',
    carMakeModel: 'Nissan 370Z Nismo',
    plateNumber: 'NIS 3701',
    registrationType: 'Competitor',
    status: 'CheckedIn',
    registrationFee: 2500,
    amountPaid: 2500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000012',
    registrationNumber: 'CS27-0012',
    registrationDate: '2027-02-13T15:05:00Z',
    participantName: 'Patricia Mae Ocampo',
    contactNumber: '09282345679',
    email: 'patricia.ocampo@example.com',
    address: '7 Del Pilar St., Daet',
    carMakeModel: 'BMW M3 E46',
    plateNumber: 'BMW 4602',
    registrationType: 'VIP',
    status: 'Confirmed',
    registrationFee: 5000,
    amountPaid: 5000,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000013',
    registrationNumber: 'CS27-0013',
    registrationDate: '2027-02-14T09:25:00Z',
    participantName: 'Dominic Salazar',
    contactNumber: '09293456780',
    email: 'dominic.salazar@example.com',
    address: '42 Aguinaldo St., Sorsogon City',
    carMakeModel: 'Toyota AE86 Trueno',
    plateNumber: 'TRU 1986',
    registrationType: 'Exhibitor',
    status: 'Pending',
    registrationFee: 1500,
    amountPaid: 500,
    paymentStatus: 'Partial',
  },
  {
    id: '11111111-1111-4111-8111-000000000014',
    registrationNumber: 'CS27-0014',
    registrationDate: '2027-02-14T13:10:00Z',
    participantName: 'Vincent Kyle Ramos',
    contactNumber: '09304567891',
    email: 'vincent.ramos@example.com',
    address: '19 Lapu-Lapu St., Iriga City',
    carMakeModel: 'Chevrolet Camaro SS',
    plateNumber: 'CAM 6200',
    registrationType: 'Competitor',
    status: 'Confirmed',
    registrationFee: 2500,
    amountPaid: 1500,
    paymentStatus: 'Partial',
  },
  {
    id: '11111111-1111-4111-8111-000000000015',
    registrationNumber: 'CS27-0015',
    registrationDate: '2027-02-14T16:40:00Z',
    participantName: 'Nicole Ann Castillo',
    contactNumber: '09315678902',
    email: 'nicole.castillo@example.com',
    address: '63 Zamora St., Ligao City',
    carMakeModel: 'Mazda Miata MX-5 ND',
    plateNumber: 'MX5 2024',
    registrationType: 'Exhibitor',
    status: 'CheckedIn',
    registrationFee: 1500,
    amountPaid: 1500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000016',
    registrationNumber: 'CS27-0016',
    registrationDate: '2027-02-15T08:00:00Z',
    participantName: 'Adrian Cruz',
    contactNumber: '09326789013',
    email: 'adrian.cruz@example.com',
    address: '118 Rizal Ave., Sorsogon City',
    carMakeModel: 'Volkswagen Golf GTI',
    plateNumber: 'GTI 7501',
    registrationType: 'Exhibitor',
    status: 'Cancelled',
    registrationFee: 1500,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000017',
    registrationNumber: 'CS27-0017',
    registrationDate: '2027-02-15T10:15:00Z',
    participantName: 'Miguelito Soriano',
    contactNumber: '09337890124',
    email: 'miguel.soriano@example.com',
    address: '27 Burgos Ave., Daraga, Albay',
    carMakeModel: 'Nissan Silvia S15',
    plateNumber: 'SIL 1500',
    registrationType: 'Competitor',
    status: 'Confirmed',
    registrationFee: 2500,
    amountPaid: 2500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000018',
    registrationNumber: 'CS27-0018',
    registrationDate: '2027-02-15T14:50:00Z',
    participantName: 'Samantha Grace Yu',
    contactNumber: '09348901235',
    email: 'samantha.yu@example.com',
    address: '505 Ayala Blvd., Legazpi City',
    carMakeModel: 'Audi RS5 Coupe',
    plateNumber: 'AUD 5500',
    registrationType: 'VIP',
    status: 'Pending',
    registrationFee: 5000,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000019',
    registrationNumber: 'CS27-0019',
    registrationDate: '2027-02-16T09:35:00Z',
    participantName: 'Kenneth Dela Rosa',
    contactNumber: '09359012346',
    email: 'kenneth.dr@example.com',
    address: '71 Quezon St., Pilar, Sorsogon',
    carMakeModel: 'Honda Integra Type R DC2',
    plateNumber: 'DC2 1998',
    registrationType: 'Competitor',
    status: 'CheckedIn',
    registrationFee: 2500,
    amountPaid: 2500,
    paymentStatus: 'Paid',
  },
  {
    id: '11111111-1111-4111-8111-000000000020',
    registrationNumber: 'CS27-0020',
    registrationDate: '2027-02-16T11:45:00Z',
    participantName: 'Clarisse Fernandez',
    contactNumber: '09360123457',
    email: 'clarisse.f@example.com',
    address: '84 San Juan St., Casiguran, Sorsogon',
    carMakeModel: 'Mini Cooper JCW',
    plateNumber: 'JCW 2022',
    registrationType: 'Exhibitor',
    status: 'Confirmed',
    registrationFee: 1500,
    amountPaid: 750,
    paymentStatus: 'Partial',
  },
  {
    id: '11111111-1111-4111-8111-000000000021',
    registrationNumber: 'CS27-0021',
    registrationDate: '2027-02-17T08:20:00Z',
    participantName: 'Lorenzo Evangelista',
    contactNumber: '09371234569',
    email: 'lorenzo.e@example.com',
    address: '29 Magsaysay St., Naga City',
    carMakeModel: 'Toyota GR Yaris',
    plateNumber: 'GRY 1618',
    registrationType: 'Competitor',
    status: 'Pending',
    registrationFee: 2500,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000022',
    registrationNumber: 'CS27-0022',
    registrationDate: '2027-02-17T13:30:00Z',
    participantName: 'Tessa Mae Bautista',
    contactNumber: '09382345670',
    email: 'tessa.b@example.com',
    address: '140 Rizal St., Sorsogon City',
    carMakeModel: 'Lexus RC F',
    plateNumber: 'LEX 5001',
    registrationType: 'VIP',
    status: 'Confirmed',
    registrationFee: 5000,
    amountPaid: 3000,
    paymentStatus: 'Partial',
  },
  {
    id: '11111111-1111-4111-8111-000000000023',
    registrationNumber: 'CS27-0023',
    registrationDate: '2027-02-18T09:10:00Z',
    participantName: 'Christian Paul Rivera',
    contactNumber: '09393456781',
    email: 'cp.rivera@example.com',
    address: '58 Mabini St., Legazpi City',
    carMakeModel: 'Subaru BRZ tS',
    plateNumber: 'BRZ 2023',
    registrationType: 'Exhibitor',
    status: 'Pending',
    registrationFee: 1500,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000024',
    registrationNumber: 'CS27-0024',
    registrationDate: '2027-02-18T14:00:00Z',
    participantName: 'Danilo Panganiban',
    contactNumber: '09454567892',
    email: 'danilo.p@example.com',
    address: '11JP Laurel St., Sorsogon City',
    carMakeModel: 'Mitsubishi Eclipse GSX',
    plateNumber: 'DSM 1999',
    registrationType: 'Competitor',
    status: 'Cancelled',
    registrationFee: 2500,
    amountPaid: 0,
    paymentStatus: 'Unpaid',
  },
  {
    id: '11111111-1111-4111-8111-000000000025',
    registrationNumber: 'CS27-0025',
    registrationDate: '2027-02-19T10:00:00Z',
    participantName: 'Elaine Joy Magno',
    contactNumber: '09465678903',
    email: 'elaine.magno@example.com',
    address: '215 Taft St., Sorsogon City',
    carMakeModel: 'Mercedes-AMG C63',
    plateNumber: 'AMG 6300',
    registrationType: 'VIP',
    status: 'Confirmed',
    registrationFee: 5000,
    amountPaid: 5000,
    paymentStatus: 'Paid',
  },
];

let store: Registration[] = [...initialSampleRegistrations];

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRegistrations(
  params: GetRegistrationsParams = {}
): Promise<PagedRegistrationsResponse> {
  await delay(250);

  let filtered = [...store];

  if (params.participantName?.trim()) {
    const search = params.participantName.trim().toLowerCase();
    filtered = filtered.filter((r) =>
      r.participantName.toLowerCase().includes(search)
    );
  }
  if (params.type) {
    filtered = filtered.filter((r) => r.registrationType === params.type);
  }
  if (params.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  filtered.sort(
    (a, b) =>
      new Date(b.registrationDate).getTime() -
      new Date(a.registrationDate).getTime()
  );

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}

export async function getSummary(): Promise<RegistrationSummary> {
  await delay(200);

  const active = store.filter((r) => r.status !== 'Cancelled');
  const totalFees = active.reduce((sum, r) => sum + r.registrationFee, 0);
  const totalPayments = active.reduce((sum, r) => sum + r.amountPaid, 0);

  return {
    totalRegistrations: store.length,
    confirmed: store.filter((r) => r.status === 'Confirmed').length,
    checkedIn: store.filter((r) => r.status === 'CheckedIn').length,
    pending: store.filter((r) => r.status === 'Pending').length,
    cancelled: store.filter((r) => r.status === 'Cancelled').length,
    totalFees,
    totalPayments,
    uncollectedPayments: totalFees - totalPayments,
  };
}

export async function getRegistrationById(id: string): Promise<Registration> {
  await delay(150);
  const found = store.find((r) => r.id === id);
  if (!found) {
    throw new Error('Registration not found.');
  }
  return found;
}

export async function createRegistration(
  payload: CreateRegistrationPayload
): Promise<Registration> {
  await delay(250);
  const normalizedPlate = payload.plateNumber.trim().toUpperCase();
  if (store.some((r) => r.plateNumber.toUpperCase() === normalizedPlate)) {
    throw new Error('A registration with this plate number already exists.');
  }

  const fee = getFeeForType(payload.registrationType);
  const nextNumber = store.length + 1;
  const created: Registration = {
    id: crypto.randomUUID(),
    registrationNumber: `CS27-${String(nextNumber).padStart(4, '0')}`,
    registrationDate: new Date().toISOString(),
    participantName: payload.participantName.trim(),
    contactNumber: payload.contactNumber.trim(),
    email: payload.email.trim(),
    address: payload.address.trim(),
    carMakeModel: payload.carMakeModel.trim(),
    plateNumber: normalizedPlate,
    registrationType: payload.registrationType,
    status: 'Pending',
    registrationFee: fee,
    amountPaid: payload.amountPaid,
    paymentStatus: computePaymentStatus(payload.amountPaid, fee),
  };

  store = [created, ...store];
  return created;
}

export async function updateRegistration(
  id: string,
  payload: UpdateRegistrationPayload
): Promise<Registration> {
  await delay(250);
  const index = store.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error('Registration not found.');
  }

  const fee = getFeeForType(payload.registrationType);
  const updated: Registration = {
    ...store[index],
    participantName: payload.participantName.trim(),
    contactNumber: payload.contactNumber.trim(),
    email: payload.email.trim(),
    address: payload.address.trim(),
    carMakeModel: payload.carMakeModel.trim(),
    plateNumber: payload.plateNumber.trim().toUpperCase(),
    registrationType: payload.registrationType,
    status: payload.status,
    registrationFee: fee,
    amountPaid: payload.amountPaid,
    paymentStatus: computePaymentStatus(payload.amountPaid, fee),
  };

  store = store.map((r) => (r.id === id ? updated : r));
  return updated;
}

export async function deleteRegistration(id: string): Promise<void> {
  await delay(200);
  store = store.filter((r) => r.id !== id);
}
