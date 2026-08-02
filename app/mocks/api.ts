type MockOptions = { method?: string; body?: Record<string, any> | FormData };

/**
 * Senha compartilhada exclusivamente para os acessos de demonstração.
 * Os dados de cada conta continuam sendo os mesmos registros que alimentam
 * as telas administrativas e do motorista.
 */
export const MOCK_DEMO_PASSWORD = 'identifica2026';

const users = [
  { id: 0, name: 'Equipe Identifica Trânsito', email: 'superadmin@identificatransito.com', phone: '(11) 3000-0000', type: 1, active: 1, created_at: '2026-07-01T08:00:00Z', vehicles_count: 0, tag_purchases_count: 0 },
  { id: 1, name: 'Marina Costa', email: 'marina.costa@email.com', phone: '(11) 99876-1200', type: 3, active: 1, created_at: '2026-07-24T10:20:00Z', vehicles_count: 2, tag_purchases_count: 3 },
  { id: 2, name: 'Rafael Almeida', email: 'rafael.almeida@email.com', phone: '(11) 98765-4321', type: 2, active: 1, created_at: '2026-07-22T14:35:00Z', vehicles_count: 4, tag_purchases_count: 6 },
  { id: 3, name: 'Camila Nunes', email: 'camila.nunes@email.com', phone: '(11) 97654-3210', type: 3, active: 1, created_at: '2026-07-20T09:05:00Z', vehicles_count: 1, tag_purchases_count: 1 },
  { id: 4, name: 'Joao Pedro Lima', email: 'joao.lima@email.com', phone: '(11) 96543-2109', type: 3, active: 1, created_at: '2026-07-18T16:40:00Z', vehicles_count: 1, tag_purchases_count: 2 },
  { id: 5, name: 'Ana Beatriz Souza', email: 'ana.souza@email.com', phone: '(11) 95432-1098', type: 3, active: 1, created_at: '2026-07-15T11:15:00Z', vehicles_count: 2, tag_purchases_count: 2 },
  { id: 6, name: 'Ponto de Venda Centro', email: 'centro@identificatransito.com', phone: '(11) 3333-1000', type: 2, active: 1, created_at: '2026-07-10T08:00:00Z', vehicles_count: 0, tag_purchases_count: 18 },
];

// Registros temporários para demonstrar listagem e paginação. Remover quando solicitado.
[
  'Lucas Ferreira', 'Beatriz Oliveira', 'Gustavo Martins', 'Larissa Rocha',
  'Felipe Santos', 'Juliana Ribeiro', 'Thiago Carvalho', 'Renata Moreira',
  'Bruno Araujo', 'Patricia Gomes', 'Diego Barbosa', 'Fernanda Castro',
  'André Teixeira', 'Mariana Freitas', 'Carlos Henrique', 'Aline Mendes',
  'Rodrigo Cardoso', 'Sabrina Alves', 'Vinicius Moraes', 'Leticia Barros',
  'Eduardo Batista', 'Natalia Farias', 'Marcelo Pires', 'Isabela Dias',
  'Leonardo Correia', 'Gabriela Lopes', 'Ricardo Ramos', 'Tatiane Lima',
  'Matheus Vieira', 'Vanessa Monteiro', 'Caio Rezende', 'Priscila Duarte',
  'Henrique Costa', 'Bianca Siqueira',
].forEach((name, index) => {
  const id = index + 7;
  users.push({
    id,
    name,
    email: `usuario${id}@email.com`,
    phone: `(11) 9${String(9000 + index).padStart(4, '0')}-${String(1000 + index).padStart(4, '0')}`,
    type: index % 9 === 0 ? 2 : 3,
    active: index % 7 === 0 ? 0 : 1,
    created_at: new Date(Date.UTC(2026, 6, 9 - index, 9, 0)).toISOString(),
    vehicles_count: index % 4,
    tag_purchases_count: (index % 5) + 1,
  });
});

export const mockDemoAccounts = [
  {
    label: 'Superadministrador',
    description: 'Acesso completo à plataforma',
    email: 'superadmin@identificatransito.com',
    password: MOCK_DEMO_PASSWORD,
  },
  {
    label: 'Administrador de PDV',
    description: 'Gestão do ponto de venda',
    email: 'rafael.almeida@email.com',
    password: MOCK_DEMO_PASSWORD,
  },
  {
    label: 'Motorista',
    description: 'Veículos, etiquetas e pedidos',
    email: 'marina.costa@email.com',
    password: MOCK_DEMO_PASSWORD,
  },
] as const;

const mockPasswords = new Map(users.map((user) => [user.email.toLowerCase(), MOCK_DEMO_PASSWORD]));

const sessionUser = (user: typeof users[number]) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  type: user.type,
  active: user.active,
});

const mockError = (message: string, statusCode = 400) => Object.assign(new Error(message), {
  data: { message },
  statusCode,
});

const vehicles = [
  { id: 1, user_id: 1, user_name: 'Marina Costa', plate: 'ABC1D23', name: 'Honda Civic', year: '2023', color: 'Prata', type: 1, type_label: 'Automovel', register_state: 'SP', register_city: 'Sao Paulo', usage_profile: 1, usage_profile_label: 'Particular', tag_color: 'azul', tag_price: '49.90', tag_purchases: [], created_at: '2026-07-24T10:30:00Z' },
  { id: 2, user_id: 1, user_name: 'Marina Costa', plate: 'DEF4G56', name: 'Jeep Renegade', year: '2022', color: 'Branco', type: 1, type_label: 'Automovel', register_state: 'SP', register_city: 'Sao Paulo', usage_profile: 1, usage_profile_label: 'Particular', tag_color: 'verde', tag_price: '59.90', tag_purchases: [], created_at: '2026-07-24T10:31:00Z' },
  { id: 3, user_id: 2, user_name: 'Rafael Almeida', plate: 'HIJ7K89', name: 'Toyota Corolla', year: '2024', color: 'Preto', type: 1, type_label: 'Automovel', register_state: 'SP', register_city: 'Campinas', usage_profile: 2, usage_profile_label: 'Profissional', tag_color: 'vermelho', tag_price: '69.90', tag_purchases: [], created_at: '2026-07-22T15:00:00Z' },
  { id: 4, user_id: 3, user_name: 'Camila Nunes', plate: 'LMN0P12', name: 'Volkswagen T-Cross', year: '2021', color: 'Azul', type: 1, type_label: 'Automovel', register_state: 'SP', register_city: 'Santos', usage_profile: 1, usage_profile_label: 'Particular', tag_color: 'amarelo', tag_price: '49.90', tag_purchases: [], created_at: '2026-07-20T09:20:00Z' },
  { id: 5, user_id: 4, user_name: 'Joao Pedro Lima', plate: 'QRS3T45', name: 'Chevrolet Onix', year: '2020', color: 'Cinza', type: 1, type_label: 'Automovel', register_state: 'SP', register_city: 'Sao Paulo', usage_profile: 1, usage_profile_label: 'Particular', tag_color: 'branco', tag_price: '54.90', tag_purchases: [], created_at: '2026-07-18T17:00:00Z' },
];

const tags = [
  { id: 1, name: 'Etiqueta Azul', slug: 'azul', description: 'Carros de aplicativos, carros de locadoras, carros de empresas.', color_name: 'azul', price: '49.90', created_at: '2026-06-01T10:00:00Z' },
  { id: 2, name: 'Etiqueta Verde', slug: 'verde', description: 'Condutores com carteira de habilitação definitiva.', color_name: 'verde', price: '59.90', created_at: '2026-06-03T10:00:00Z' },
  { id: 3, name: 'Etiqueta Vermelha', slug: 'vermelho', description: 'Motoristas com carteira de habilitação temporária.', color_name: 'vermelho', price: '69.90', created_at: '2026-06-05T10:00:00Z' },
  { id: 4, name: 'Etiqueta Amarela', slug: 'amarelo', description: 'Gestantes ou motoristas com recém-nascidos.', color_name: 'amarelo', price: '49.90', created_at: '2026-06-06T10:00:00Z' },
  { id: 5, name: 'Etiqueta Branca', slug: 'branco', description: 'Pessoas com mais de 60 anos, PCD e condições não visíveis, como autismo e deficiências ocultas.', color_name: 'branco', price: '54.90', created_at: '2026-06-08T10:00:00Z' },
];

const pickupPoints = [
  { id: 1, name: 'PDV Centro - Sao Paulo', label: 'PDV Centro - Sao Paulo', cnpj: '12.345.678/0001-90', address: 'Av. Paulista, 1000 - Sao Paulo/SP', phone: '(11) 3333-1000', responsible: 'Rafael Almeida', map_link: null, active: true, created_at: '2026-07-10T08:00:00Z' },
  { id: 2, name: 'PDV Zona Sul - Sao Paulo', label: 'PDV Zona Sul - Sao Paulo', cnpj: '98.765.432/0001-10', address: 'Rua dos Pinheiros, 550 - Sao Paulo/SP', phone: '(11) 3222-2000', responsible: 'Ponto de Venda Centro', map_link: null, active: true, created_at: '2026-07-12T08:00:00Z' },
];

const settings = [
  { id: 1, type: 'EMAIL', value: '1', active: 1 },
  { id: 2, type: 'SMS_WHATSAPP', value: '0', active: 1 },
  { id: 3, type: 'ALERTS_DRIVERS', value: '1', active: 1 },
];

const faqs = [
  { id: 1, question: 'Como cadastro meu veículo?', answer: 'Acesse a área Meus Veículos, selecione Cadastrar novo veículo e preencha os dados solicitados.', active: true, order: 1, created_at: '2026-07-02T09:30:00Z', updated_at: '2026-07-02T09:30:00Z' },
  { id: 2, question: 'Como acompanho o status do meu pedido?', answer: 'Em Meus Pedidos você encontra o status atualizado, o código de rastreio e os detalhes da retirada ou entrega.', active: true, order: 2, created_at: '2026-07-04T14:15:00Z', updated_at: '2026-07-10T11:20:00Z' },
  { id: 3, question: 'Onde posso retirar a minha etiqueta?', answer: 'Após a confirmação do pedido, o ponto de venda selecionado e o endereço de retirada ficam disponíveis nos detalhes do pedido.', active: true, order: 3, created_at: '2026-07-08T10:00:00Z', updated_at: '2026-07-08T10:00:00Z' },
  { id: 4, question: 'Posso alterar os dados de um veículo?', answer: 'Sim. Abra o veículo na sua lista e selecione Editar para atualizar os dados permitidos.', active: true, order: 4, created_at: '2026-07-12T16:40:00Z', updated_at: '2026-07-12T16:40:00Z' },
  { id: 5, question: 'Como utilizo um cupom de desconto?', answer: 'No checkout, informe o código do cupom antes de finalizar o pagamento. O desconto será calculado automaticamente.', active: false, order: 5, created_at: '2026-07-15T08:50:00Z', updated_at: '2026-07-18T13:10:00Z' },
];

const discountCoupons = [
  { id: 1, code: 'BEMVINDO10', type: 1, value: '10', qty: null, used_qty: 18, expiration_date: '2026-12-31 23:59:00', created_at: '2026-07-01T08:00:00Z', updated_at: '2026-07-01T08:00:00Z' },
  { id: 2, code: 'PRIMEIRACOMPRA', type: 2, value: '15.00', qty: 100, used_qty: 42, expiration_date: '2026-10-31 23:59:00', created_at: '2026-07-05T10:30:00Z', updated_at: '2026-07-14T15:45:00Z' },
  { id: 3, code: 'FRETEZERO', type: 2, value: '12.00', qty: 50, used_qty: 50, expiration_date: '2026-08-15 23:59:00', created_at: '2026-07-11T09:15:00Z', updated_at: '2026-07-30T18:00:00Z' },
  { id: 4, code: 'JULHO20', type: 1, value: '20', qty: 75, used_qty: 9, expiration_date: '2026-08-31 23:59:00', created_at: '2026-07-20T11:00:00Z', updated_at: '2026-07-20T11:00:00Z' },
  { id: 5, code: 'PDVCENTRO5', type: 2, value: '5.00', qty: null, used_qty: 6, expiration_date: null, created_at: '2026-07-25T13:25:00Z', updated_at: '2026-07-25T13:25:00Z' },
];

const orders = [
  { id: 101, vehicle_id: 1, vehicle_name: 'Honda Civic', vehicle_plate: 'ABC1D23', user_id: 1, user_name: 'Marina Costa', tag_id: 1, tag_name: 'Etiqueta Azul', tag_slug: 'azul', discount_coupon: null, coupon_info: null, qty: 2, price: '49.90', price_total: '99.80', shipping_price: '12.00', delivery: null, pickup_point: null, payment_method: 'pix', mp_payment_id: 'PIX-202607-1001', mp_payment_status: 'approved', mp_payment_status_label: 'Aprovado', boleto_url: null, status: 1, shipment: { id: 1, tracking_code: 'BR123456789BR', carrier: 'Correios', carrier_service: 'SEDEX', status: 2, status_label: 'Em transito', estimated_delivery_at: '2026-07-31T00:00:00Z', delivered_at: null, last_event: 'Objeto em transito', notes: null }, created_at: '2026-07-28T13:20:00Z' },
  { id: 102, vehicle_id: 3, vehicle_name: 'Toyota Corolla', vehicle_plate: 'HIJ7K89', user_id: 2, user_name: 'Rafael Almeida', tag_id: 3, tag_name: 'Etiqueta Vermelha', tag_slug: 'vermelho', discount_coupon: 1, coupon_info: { code: 'BEMVINDO10', type: 2, value: '10.00' }, qty: 1, price: '69.90', price_total: '62.91', shipping_price: '0.00', delivery: null, pickup_point: { id: 1, label: 'PDV Centro - Sao Paulo' }, payment_method: 'credit_card', mp_payment_id: 'MP-202607-1002', mp_payment_status: 'approved', mp_payment_status_label: 'Aprovado', boleto_url: null, status: 1, shipment: { id: 2, tracking_code: null, carrier: 'Retirada no PDV', carrier_service: null, status: 1, status_label: 'Disponivel para retirada', estimated_delivery_at: null, delivered_at: null, last_event: null, notes: null }, created_at: '2026-07-27T09:45:00Z' },
  { id: 103, vehicle_id: 4, vehicle_name: 'Volkswagen T-Cross', vehicle_plate: 'LMN0P12', user_id: 3, user_name: 'Camila Nunes', tag_id: 4, tag_name: 'Etiqueta Amarela', tag_slug: 'amarelo', discount_coupon: null, coupon_info: null, qty: 1, price: '49.90', price_total: '49.90', shipping_price: '12.00', delivery: null, pickup_point: null, payment_method: 'boleto', mp_payment_id: 'BOL-202607-1003', mp_payment_status: 'pending', mp_payment_status_label: 'Pendente', boleto_url: '#', status: 0, shipment: null, created_at: '2026-07-26T17:10:00Z' },
  { id: 104, vehicle_id: 5, vehicle_name: 'Chevrolet Onix', vehicle_plate: 'QRS3T45', user_id: 4, user_name: 'Joao Pedro Lima', tag_id: 5, tag_name: 'Etiqueta Branca', tag_slug: 'branco', discount_coupon: null, coupon_info: null, qty: 3, price: '54.90', price_total: '164.70', shipping_price: '0.00', delivery: null, pickup_point: { id: 2, label: 'PDV Zona Sul - Sao Paulo' }, payment_method: 'pix', mp_payment_id: 'PIX-202607-1004', mp_payment_status: 'approved', mp_payment_status_label: 'Aprovado', boleto_url: null, status: 1, shipment: { id: 4, tracking_code: null, carrier: 'Retirada no PDV', carrier_service: null, status: 4, status_label: 'Retirado', estimated_delivery_at: null, delivered_at: '2026-07-27T14:00:00Z', last_event: 'Pedido retirado', notes: null }, created_at: '2026-07-25T11:30:00Z' },
];

const page = <T>(items: T[], search: string | null, fields: (keyof T)[], query?: URLSearchParams) => {
  const term = search?.toLowerCase().trim();
  const filteredItems = term ? items.filter((item) => fields.some((field) => String(item[field] ?? '').toLowerCase().includes(term))) : items;
  const currentPage = Math.max(1, Number(query?.get('page') ?? 1));
  const perPage = Math.max(1, Number(query?.get('per_page') ?? 15));
  const lastPage = Math.max(1, Math.ceil(filteredItems.length / perPage));
  const safePage = Math.min(currentPage, lastPage);
  const start = (safePage - 1) * perPage;
  return {
    data: filteredItems.slice(start, start + perPage),
    meta: { current_page: safePage, last_page: lastPage, total: filteredItems.length },
  };
};

const orderSummary = (order: typeof orders[number]) => ({
  id: order.id, mp_payment_id: order.mp_payment_id, mp_payment_status: order.mp_payment_status, payment_method: order.payment_method,
  qty: order.qty, price: order.price, price_total: order.price_total, status: order.status, created_at: order.created_at,
  tag_name: order.tag_name, tag_slug: order.tag_slug, shipment: order.shipment,
  vehicle: { id: order.vehicle_id, plate: order.vehicle_plate, name: order.vehicle_name, color: vehicles.find((vehicle) => vehicle.id === order.vehicle_id)?.color ?? '' },
});

const isInPeriod = (value: string, dateFrom: string | null, dateTo: string | null) => {
  const date = value.slice(0, 10);
  return (!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo);
};

const getDashboardPayload = (dateFrom: string | null, dateTo: string | null, isPdv = false) => {
  const filteredOrders = orders.filter((order) => isInPeriod(order.created_at, dateFrom, dateTo));
  const paidOrders = filteredOrders.filter((order) => order.status === 1 || order.mp_payment_status === 'approved');
  const filteredUsers = users.filter((user) => isInPeriod(user.created_at, dateFrom, dateTo));
  const filteredVehicles = vehicles.filter((vehicle) => isInPeriod(vehicle.created_at, dateFrom, dateTo));
  const tagSales = tags.map((tag) => ({
    tag_name: tag.name,
    tag_slug: tag.slug,
    qty: paidOrders.filter((order) => order.tag_slug === tag.slug).reduce((total, order) => total + order.qty, 0),
  }));
  let balance = 0;
  const balanceHistory = paidOrders
    .slice()
    .sort((first, second) => first.created_at.localeCompare(second.created_at))
    .map((order) => ({ date: order.created_at, balance: (balance += Number(order.price_total)) }));
  const revenue = paidOrders.reduce((total, order) => total + Number(order.price_total), 0);

  return {
    data: {
      totals: {
        users: isPdv ? filteredUsers.filter((user) => user.type === 3).length : filteredUsers.length,
        vehicles: filteredVehicles.length,
        orders: filteredOrders.length,
        revenue,
        ...(isPdv ? { commission_amount: revenue * 0.12 } : {}),
      },
      latest_users: (isPdv ? filteredUsers.filter((user) => user.type === 3) : filteredUsers).slice(0, 5),
      latest_orders: filteredOrders.slice(0, 5).map(orderSummary),
      tag_sales: tagSales,
      balance_history: balanceHistory,
    },
  };
};

export const mockApi = async (request: string, options: MockOptions = {}) => {
  const [path, queryString = ''] = request.split('?');
  const query = new URLSearchParams(queryString);
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body instanceof FormData
    ? Object.fromEntries(options.body.entries())
    : (options.body || {});

  // Autenticação ------------------------------------------------------------
  // Mantém o primeiro fluxo do sistema completamente local durante a demo.
  if (path === '/login' && method === 'POST') {
    const email = String(body.email ?? '').trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === email && item.active);
    if (!user || mockPasswords.get(email) !== body.password) {
      throw mockError('E-mail ou senha inválidos.', 401);
    }
    return { token: `mock-token-${user.id}`, user: sessionUser(user) };
  }
  if (path === '/logout' && method === 'POST') return { success: true };
  if (path === '/forgot-password' || path === '/reset-password') return { success: true, message: 'Solicitação processada com sucesso.' };

  if (path === '/users' && method === 'POST') {
    const email = String(body.email ?? '').trim().toLowerCase();
    if (!email) throw mockError('Informe um e-mail válido.');
    if (users.some((user) => user.email.toLowerCase() === email)) throw mockError('Este e-mail já está em uso.', 422);
    const user = {
      id: Date.now(),
      name: String(body.name ?? 'Novo motorista'),
      email,
      phone: String(body.phone ?? ''),
      type: 3,
      active: 1,
      created_at: new Date().toISOString(),
      vehicles_count: 0,
      tag_purchases_count: 0,
    };
    users.unshift(user);
    mockPasswords.set(email, String(body.password || MOCK_DEMO_PASSWORD));
    return { data: sessionUser(user) };
  }

  if (path === '/admin/dashboard') return getDashboardPayload(query.get('date_from'), query.get('date_to'));
  if (path === '/admin/pdv-commissions') return { data: [
    { admin_id: 2, admin_name: 'Rafael Almeida', admin_email: 'rafael.almeida@email.com', pdv_id: 1, pdv_name: 'PDV Centro - Sao Paulo', commission_type: 2, commission_type_label: 'Percentual', commission_value: 12, total_sales_qty: 24, total_sales_amount: 1437.60, commission_amount: 172.51 },
    { admin_id: 6, admin_name: 'Ponto de Venda Centro', admin_email: 'centro@identificatransito.com', pdv_id: 2, pdv_name: 'PDV Zona Sul - Sao Paulo', commission_type: 1, commission_type_label: 'Valor fixo', commission_value: 8, total_sales_qty: 18, total_sales_amount: 1038.20, commission_amount: 144.00 },
  ], meta: { current_page: 1, last_page: 1, total: 2 } };

  if (path === '/admin/users/totals') return { data: { active: users.length, pdv: users.filter((user) => user.type === 2).length, deleted: 2 } };
  if (path === '/admin/users') {
    if (method === 'POST') { const user = { id: Date.now(), active: 1, created_at: new Date().toISOString(), vehicles_count: 0, tag_purchases_count: 0, ...body }; users.unshift(user); return { data: user }; }
    return page(users, query.get('q'), ['name', 'email'], query);
  }
  const userMatch = path.match(/^\/admin\/users\/(\d+)$/);
  if (userMatch) {
    const user = users.find((item) => item.id === Number(userMatch[1]));
    if (method === 'DELETE') return { success: true };
    if (method === 'PUT' && user) Object.assign(user, body);
    return { data: user };
  }

  if (path === '/admin/vehicles/totals') return { data: { registered: vehicles.length, by_type: [{ id: 1, total: vehicles.length }], deleted: 1 } };
  if (path === '/admin/vehicles') return page(vehicles, query.get('q'), ['name', 'plate', 'user_name'], query);
  const vehicleMatch = path.match(/^\/admin\/vehicles\/(\d+)$/);
  if (vehicleMatch) return { data: vehicles.find((item) => item.id === Number(vehicleMatch[1])) };

  if (path === '/admin/tags') {
    if (method === 'POST') { const tag = { id: Date.now(), created_at: new Date().toISOString(), ...body }; tags.unshift(tag); return { data: tag }; }
    return page(tags, query.get('q'), ['name', 'color_name', 'description'], query);
  }
  const tagMatch = path.match(/^\/admin\/tags\/(\d+)$/);
  if (tagMatch) {
    const index = tags.findIndex((item) => item.id === Number(tagMatch[1]));
    const tag = tags[index];
    if (method === 'DELETE') {
      if (index >= 0) tags.splice(index, 1);
      return { success: true };
    }
    if (method === 'PUT' && tag) Object.assign(tag, body);
    return { data: tag };
  }

  if (path === '/admin/faqs') {
    if (method === 'POST') {
      const faq = { id: Date.now(), order: faqs.length + 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...body, active: Boolean(body.active) };
      faqs.push(faq);
      return { data: faq };
    }
    return { data: faqs.slice().sort((first, second) => first.order - second.order) };
  }
  const faqReorderMatch = path.match(/^\/admin\/faqs\/(\d+)\/reorder$/);
  if (faqReorderMatch && method === 'PATCH') {
    const faq = faqs.find((item) => item.id === Number(faqReorderMatch[1]));
    if (faq) {
      const nextOrder = Math.max(1, Number(body.order) || 1);
      faqs.splice(faqs.indexOf(faq), 1);
      faqs.splice(nextOrder - 1, 0, faq);
      faqs.forEach((item, index) => { item.order = index + 1; item.updated_at = new Date().toISOString(); });
    }
    return { success: true, data: faq };
  }
  const faqMatch = path.match(/^\/admin\/faqs\/(\d+)$/);
  if (faqMatch) {
    const index = faqs.findIndex((item) => item.id === Number(faqMatch[1]));
    const faq = faqs[index];
    if (method === 'DELETE') {
      if (index >= 0) faqs.splice(index, 1);
      return { success: true };
    }
    if (method === 'PUT' && faq) Object.assign(faq, body, { active: Boolean(body.active), updated_at: new Date().toISOString() });
    return { data: faq };
  }

  if (path === '/admin/discount-coupons') {
    if (method === 'POST') {
      const coupon = { id: Date.now(), used_qty: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...body };
      discountCoupons.unshift(coupon);
      return { data: coupon };
    }
    return page(discountCoupons, query.get('q'), ['code'], query);
  }
  const couponMatch = path.match(/^\/admin\/discount-coupons\/(\d+)$/);
  if (couponMatch) {
    const index = discountCoupons.findIndex((item) => item.id === Number(couponMatch[1]));
    const coupon = discountCoupons[index];
    if (method === 'DELETE') {
      if (index >= 0) discountCoupons.splice(index, 1);
      return { success: true };
    }
    if (method === 'PUT' && coupon) Object.assign(coupon, body, { updated_at: new Date().toISOString() });
    return { data: coupon };
  }

  if (path === '/admin/orders') return page(orders, query.get('q'), ['user_name', 'vehicle_name', 'vehicle_plate', 'mp_payment_id'], query);
  const orderMatch = path.match(/^\/admin\/orders\/(\d+)(?:\/shipment)?$/);
  if (orderMatch) {
    const order = orders.find((item) => item.id === Number(orderMatch[1]));
    if (order && method === 'PATCH') {
      if (path.endsWith('/shipment')) order.shipment = { ...(order.shipment || { id: Date.now(), tracking_code: null, carrier: 'Correios', carrier_service: 'PAC', status_label: '', estimated_delivery_at: null, delivered_at: null, last_event: null, notes: null }), ...body };
      else Object.assign(order, body);
    }
    return { data: order };
  }

  if (path === '/points-of-sale') return { data: pickupPoints.filter((point) => point.active).map(({ id, name }) => ({ id, name })) };
  if (path === '/admin/pickup-points') {
    if (method === 'POST') {
      const point = { id: Date.now(), created_at: new Date().toISOString(), ...body, active: Boolean(body.active), label: String(body.name ?? '') };
      pickupPoints.unshift(point);
      return { data: point };
    }
    return page(pickupPoints, query.get('q'), ['name', 'address', 'responsible'], query);
  }
  const pickupPointMatch = path.match(/^\/admin\/pickup-points\/(\d+)$/);
  if (pickupPointMatch) {
    const index = pickupPoints.findIndex((item) => item.id === Number(pickupPointMatch[1]));
    const point = pickupPoints[index];
    if (method === 'DELETE') {
      if (index >= 0) pickupPoints.splice(index, 1);
      return { success: true };
    }
    if (method === 'PUT' && point) Object.assign(point, body, { active: Boolean(body.active), label: String(body.name ?? point.name) });
    return { data: point };
  }

  // Admin de ponto de venda -------------------------------------------------
  if (path === '/admin-pdv/dashboard') return getDashboardPayload(query.get('date_from'), query.get('date_to'), true);
  if (path === '/admin-pdv/users/totals') return { data: { active: 4, deleted: 1 } };
  if (path === '/admin-pdv/users') {
    if (method === 'POST') {
      const user = { id: Date.now(), active: 1, type: 3, created_at: new Date().toISOString(), vehicles_count: 0, tag_purchases_count: 0, ...body };
      users.unshift(user);
      return { data: user };
    }
    return page(users.filter((user) => user.type === 3), query.get('q'), ['name', 'email'], query);
  }
  if (path === '/admin-pdv/vehicles/totals') return { data: { registered: vehicles.length, by_type: [{ id: 1, total: vehicles.length }], deleted: 0 } };
  if (path === '/admin-pdv/vehicles') return page(vehicles, query.get('q'), ['name', 'plate', 'user_name'], query);
  if (path === '/admin-pdv/orders') return page(orders.slice(0, 3), query.get('q'), ['user_name', 'vehicle_name', 'vehicle_plate', 'mp_payment_id'], query);
  if (/^\/admin-pdv\/(users|vehicles|orders)\/\d+/.test(path)) return { success: true, data: { ...body } };

  // Área do cliente ---------------------------------------------------------
  const clientVehicles = vehicles.filter((vehicle) => [1, 2].includes(vehicle.id)).map((vehicle) => ({ ...vehicle, can_purchase_tag: vehicle.id !== 1 }));
  const clientOrders = orders.slice(0, 3).map((order) => ({
    ...order,
    pickup_point: order.pickup_point ? { id: order.pickup_point.id, name: order.pickup_point.label, cnpj: '12.345.678/0001-90', phone: '(11) 3333-1000', address: 'Av. Paulista, 1000 - Sao Paulo/SP' } : null,
    vehicle: { id: order.vehicle_id, name: order.vehicle_name, plate_number: order.vehicle_plate, color: vehicles.find((vehicle) => vehicle.id === order.vehicle_id)?.color ?? '', year: vehicles.find((vehicle) => vehicle.id === order.vehicle_id)?.year ?? '', tag_slug: order.tag_slug },
  }));
  if (path === '/vehicles') {
    if (method === 'POST') return { data: { id: Date.now(), ...body, can_purchase_tag: true } };
    return { data: clientVehicles };
  }
  const clientVehicleMatch = path.match(/^\/vehicles\/(\d+)$/);
  if (clientVehicleMatch) {
    const vehicle = clientVehicles.find((item) => item.id === Number(clientVehicleMatch[1]));
    if (method === 'DELETE') return { success: true };
    if (method === 'PUT') return { data: { ...vehicle, ...body } };
    return { data: vehicle };
  }
  if (path === '/vehicles/count') return { data: { count: clientVehicles.length } };
  if (path === '/tag-purchases/count') return { data: { total: 3 } };
  if (path === '/tag-purchases/coupon-preview' && method === 'POST') {
    const coupon = discountCoupons.find((item) => item.code.toLowerCase() === String(body.coupon_discount ?? '').trim().toLowerCase());
    if (!coupon || (coupon.qty !== null && coupon.used_qty >= coupon.qty)) throw mockError('Cupom de desconto inválido ou expirado.', 422);
    const subtotal = (Array.isArray(body.vehicles) ? body.vehicles.length : 1) * 49.9;
    const discount = coupon.type === 1 ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value);
    return { data: { coupon: { code: coupon.code, type: coupon.type, value: Number(coupon.value) }, subtotal, discount, total: Math.max(0, subtotal - discount) } };
  }
  if (path === '/tag-purchases' && method === 'POST') {
    const paymentId = Date.now();
    const paymentMethod = String(body.payment_method ?? 'pix');
    if (paymentMethod === 'pix') return {
      payment_id: paymentId,
      status: 'pending',
      status_label: 'Aguardando pagamento',
      qr_code: `00020126360014BR.GOV.BCB.PIX0114mock-${paymentId}5204000053039865802BR5922Identifica Transito6009Sao Paulo62070503***6304`,
      qr_code_base64: null,
    };
    if (paymentMethod === 'boleto') return { payment_id: paymentId, status: 'pending', status_label: 'Boleto gerado', boleto_url: '#', barcode: `00190.00009 ${paymentId}` };
    return { payment_id: paymentId, status: 'approved', status_label: 'Pagamento aprovado', status_detail: 'accredited' };
  }
  const tagPurchaseStatusMatch = path.match(/^\/tag-purchases\/(\d+)\/status$/);
  if (tagPurchaseStatusMatch) return { payment_id: Number(tagPurchaseStatusMatch[1]), status: 'pending', status_detail: 'pending_waiting_payment', status_label: 'Aguardando pagamento' };
  if (path === '/orders') return { data: clientOrders, meta: { current_page: 1, last_page: 1, total: clientOrders.length } };
  if (path === '/orders/resume') return { total: clientOrders.length, pending: 1, processing: 1, delivered: 1 };
  if (path === '/shipments/totals-by-status') return { data: [{ key: 0, name: 'Aguardando postagem', value: 1 }, { key: 1, name: 'Postado', value: 0 }, { key: 2, name: 'Em transito', value: 1 }, { key: 4, name: 'Entregue', value: 1 }] };
  if (/^\/shipments\/\d+\/deliver$/.test(path)) return { success: true };
  if (path === '/faqs') return { data: faqs.filter((faq) => faq.active).slice().sort((first, second) => first.order - second.order) };
  if (path === '/settings') {
    if (method === 'POST') {
      const setting = { id: Date.now(), active: 1, ...body };
      settings.push(setting);
      return { data: setting };
    }
    return { data: settings };
  }
  const settingMatch = path.match(/^\/settings\/(\d+)$/);
  if (settingMatch) {
    const setting = settings.find((item) => item.id === Number(settingMatch[1]));
    if (method === 'PUT' && setting) Object.assign(setting, body);
    if (method === 'DELETE') return { success: true };
    return { data: setting };
  }
  const userPasswordMatch = path.match(/^\/users\/(\d+)\/password$/);
  if (userPasswordMatch && method === 'PUT') {
    const user = users.find((item) => item.id === Number(userPasswordMatch[1]));
    if (user) mockPasswords.set(user.email.toLowerCase(), String(body.new_password || MOCK_DEMO_PASSWORD));
    return { success: true };
  }
  const currentUserMatch = path.match(/^\/users\/(\d+)$/);
  if (currentUserMatch) {
    const user = users.find((item) => item.id === Number(currentUserMatch[1])) || users.find((item) => item.type === 3)!;
    if (['PUT', 'POST'].includes(method)) Object.assign(user, body);
    return { data: { ...sessionUser(user), cpf: '12345678901', gender: 'Outro', birth_date: '1995-05-15', photo: null } };
  }
  if (path === '/notifications-drivers/unread-total') return { unread_total: 2 };
  if (path === '/notifications') return { data: [
    {
      id: 1,
      title: 'Pedido em trânsito',
      message: 'Seu pedido #PIX-202607-1001 está a caminho. Acompanhe a entrega em Meus Pedidos.',
      read: false
    },
    { id: 2, title: 'Etiqueta pronta para retirada', message: 'Sua etiqueta vermelha ja esta disponivel no ponto de retirada selecionado.', read: false },
    { id: 3, title: 'Pedido entregue', message: 'O pedido #MP-202607-1002 foi entregue com sucesso.', read: false },
    { id: 4, title: 'Atualizacao cadastral', message: 'Os dados do seu veiculo foram atualizados no painel.', read: false },
    { id: 5, title: 'Lembrete de seguranca', message: 'Mantenha suas informacoes sempre atualizadas para uma conducao mais segura.', read: false }
  ] };
  if (path === '/notifications-drivers' && method === 'POST') return { data: {
    id: Date.now(), user_id: 902, plate: String(body.plate ?? 'ABC1D23'), type: Number(body.type ?? 1), type_label: 'Alerta de segurança', read: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  } };
  const driverNotificationMatch = path.match(/^\/notifications-drivers\/(\d+)$/);
  if (driverNotificationMatch && ['PUT', 'DELETE'].includes(method)) return { success: true, data: { id: Number(driverNotificationMatch[1]), ...body } };
  if (path === '/notifications-drivers') return { data: [
    { id: 11, user_id: 902, plate: 'ABC1D23', type: 1, type_label: 'Pneu murcho/furado', read: 1, created_at: '2026-07-30T09:20:00Z', updated_at: '2026-07-30T09:20:00Z' },
    { id: 12, user_id: 902, plate: 'DEF4G56', type: 2, type_label: 'Farol ou lanterna queimada', read: 1, created_at: '2026-07-29T16:45:00Z', updated_at: '2026-07-29T16:45:00Z' },
    { id: 13, user_id: 902, plate: 'HIJ7K89', type: 4, type_label: 'Algo caindo do carro', read: 1, created_at: '2026-07-28T11:10:00Z', updated_at: '2026-07-28T11:10:00Z' }
  ] };
  if (path === '/notifications-drivers/received') return { data: [
    { id: 21, user_id: 201, plate: 'KLM2N34', type: 3, type_label: 'Porta aberta', read: 0, created_at: '2026-07-30T08:55:00Z', updated_at: '2026-07-30T08:55:00Z' },
    { id: 22, user_id: 202, plate: 'OPQ5R67', type: 1, type_label: 'Pneu murcho/furado', read: 0, created_at: '2026-07-29T18:30:00Z', updated_at: '2026-07-29T18:30:00Z' },
    { id: 23, user_id: 203, plate: 'STU8V90', type: 2, type_label: 'Farol ou lanterna queimada', read: 1, created_at: '2026-07-28T14:15:00Z', updated_at: '2026-07-28T14:15:00Z' }
  ] };

  // Em modo demonstração retornamos uma estrutura neutra para integrações que
  // ainda não possuem backend, sem poluir o console durante a apresentação.
  return { data: [] };
};
