-- e-Hotels: 2b Population

-- Hotel Chains
INSERT INTO HotelChain (chain_ID, name, num_hotels, address) VALUES
(1, 'Marriott International',   10, '7750 Wisconsin Ave, Bethesda, MD, USA'),
(2, 'Hilton Worldwide',          9, '7930 Jones Branch Dr, McLean, VA, USA'),
(3, 'Hyatt Hotels Corporation',  8, '150 N Riverside Plaza, Chicago, IL, USA'),
(4, 'IHG Hotels & Resorts',      9, '3 Ravinia Dr NE, Atlanta, GA, USA'),
(5, 'Wyndham Hotels & Resorts',  8, '22 Sylvan Way, Parsippany, NJ, USA');

INSERT INTO ChainEmail VALUES
(1,'marriott.support@marriott.com'),(1,'reservations@marriott.com'),
(2,'info@hilton.com'),(2,'support@hilton.com'),
(3,'contact@hyatt.com'),(3,'reservations@hyatt.com'),
(4,'info@ihg.com'),(4,'support@ihg.com'),
(5,'info@wyndham.com'),(5,'reservations@wyndham.com');

INSERT INTO ChainPhone VALUES
(1,'1-800-221-1112'),(1,'1-800-721-7033'),
(2,'1-800-445-8667'),(2,'1-800-548-8690'),
(3,'1-800-323-7234'),(3,'1-888-591-1234'),
(4,'1-800-465-4329'),(4,'1-877-834-3613'),
(5,'1-800-466-1589'),(5,'1-877-999-3223');


-- Customers
INSERT INTO Customer (customer_ID, name, address, ID_type, ID_num, date) VALUES
(1,  'Alice Martin',     '12 Maple St, Ottawa, ON',       'SIN',      '123-456-789', '2022-03-10'),
(2,  'Bob Tremblay',     '45 Oak Ave, Montreal, QC',      'SIN',      '234-567-890', '2021-07-22'),
(3,  'Carol Singh',      '78 Pine Rd, Toronto, ON',       'Passport', 'CA9012345',   '2023-01-05'),
(4,  'David Lee',        '90 Elm Blvd, Vancouver, BC',    'DL',       'BC-4839201',  '2022-11-30'),
(5,  'Eva Nguyen',       '33 Birch Cres, Calgary, AB',    'SIN',      '345-678-901', '2020-06-15'),
(6,  'Frank Okafor',     '55 Cedar Dr, Ottawa, ON',       'Passport', 'NG8123456',   '2023-04-18'),
(7,  'Grace Kim',        '102 Willow Way, Toronto, ON',   'SIN',      '456-789-012', '2021-09-09'),
(8,  'Hiro Tanaka',      '88 Spruce Ln, Ottawa, ON',      'Passport', 'JP5678901',   '2022-12-01'),
(9,  'Isabella Rossi',   '21 Aspen Ct, Montreal, QC',     'SIN',      '567-890-123', '2023-06-20'),
(10, 'James Wilson',     '67 Fir St, Vancouver, BC',      'DL',       'BC-7654321',  '2020-02-14'),
(11, 'Karen Dupont',     '14 Larch Ave, Quebec City, QC', 'SIN',      '678-901-234', '2021-03-03'),
(12, 'Liam O''Brien',    '39 Poplar Blvd, Halifax, NS',   'Passport', 'IE3456789',   '2022-08-08'),
(13, 'Mia Chen',         '53 Hickory Rd, Ottawa, ON',     'SIN',      '789-012-345', '2023-09-11'),
(14, 'Nathan Brown',     '76 Magnolia St, Calgary, AB',   'DL',       'AB-9182736',  '2021-05-27'),
(15, 'Olivia Fontaine',  '8 Chestnut Pl, Ottawa, ON',     'SIN',      '890-123-456', '2020-10-10');


-- Hotels (manager_ID set to NULL first, updated after employees are inserted)
-- Chain 1: Marriott (10 hotels — Ottawa x2, Montreal, Toronto, Vancouver, Calgary, Quebec City, Halifax, Edmonton, Winnipeg)
INSERT INTO Hotel (hotel_ID, chain_ID, name, address, star_cat, num_rooms, manager_ID) VALUES
(101, 1, 'Marriott Ottawa Downtown',     '100 Kent St, Ottawa, ON',           4, 8, NULL),
(102, 1, 'Marriott Ottawa East',         '200 Montreal Rd, Ottawa, ON',       3, 7, NULL),
(103, 1, 'Marriott Montreal Centre',     '1255 Jeanne-Mance, Montreal, QC',   5, 8, NULL),
(104, 1, 'Marriott Toronto Harbour',     '1 Harbour Sq, Toronto, ON',         4, 7, NULL),
(105, 1, 'Marriott Vancouver Pinnacle',  '1128 W Hastings, Vancouver, BC',    5, 6, NULL),
(106, 1, 'Marriott Calgary Airport',     '2850 Sunridge Way, Calgary, AB',    3, 6, NULL),
(107, 1, 'Marriott Quebec City',         '900 Boul Rene-Levesque, QC',        5, 5, NULL),
(108, 1, 'Marriott Halifax Harbourfront','1919 Upper Water St, Halifax, NS',  4, 6, NULL),
(109, 1, 'Marriott Edmonton South',      '10235 101 St, Edmonton, AB',        3, 5, NULL),
(110, 1, 'Marriott Winnipeg',            '2 Lombard Pl, Winnipeg, MB',        2, 5, NULL);

-- Chain 2: Hilton (9 hotels — Ottawa x2)
INSERT INTO Hotel (hotel_ID, chain_ID, name, address, star_cat, num_rooms, manager_ID) VALUES
(201, 2, 'Hilton Ottawa',               '150 Albert St, Ottawa, ON',          4, 7, NULL),
(202, 2, 'Hilton Ottawa Airport',       '1000 Airport Pkwy, Ottawa, ON',      3, 6, NULL),
(203, 2, 'Hilton Montreal Bonaventure', '900 De La Gauchetiere, Montreal',    5, 8, NULL),
(204, 2, 'Hilton Toronto',              '145 Richmond St W, Toronto, ON',     4, 7, NULL),
(205, 2, 'Hilton Vancouver Metrotown',  '6083 McKay Ave, Burnaby, BC',        3, 6, NULL),
(206, 2, 'Hilton Calgary Downtown',     '401 9 Ave SW, Calgary, AB',          4, 6, NULL),
(207, 2, 'Hilton Quebec City',          '1100 Boul Rene-Levesque, QC',        5, 5, NULL),
(208, 2, 'Hilton Halifax',              '1649 Hollis St, Halifax, NS',         3, 5, NULL),
(209, 2, 'Hilton Edmonton',             '10235 101 St NW, Edmonton, AB',      4, 5, NULL);

-- Chain 3: Hyatt (8 hotels — Ottawa x1)
INSERT INTO Hotel (hotel_ID, chain_ID, name, address, star_cat, num_rooms, manager_ID) VALUES
(301, 3, 'Hyatt Ottawa Regency',        '180 Cooper St, Ottawa, ON',          5, 6, NULL),
(302, 3, 'Hyatt Montreal',              '1255 Jeanne Mance, Montreal, QC',    4, 6, NULL),
(303, 3, 'Hyatt Toronto',               '370 King St W, Toronto, ON',         5, 7, NULL),
(304, 3, 'Hyatt Vancouver',             '655 Burrard St, Vancouver, BC',      4, 6, NULL),
(305, 3, 'Hyatt Calgary',               '700 Centre St S, Calgary, AB',       3, 6, NULL),
(306, 3, 'Hyatt Quebec City',           '700 Grande Allee E, QC',             5, 5, NULL),
(307, 3, 'Hyatt Halifax',               '5855 Terminal Rd, Halifax, NS',      3, 5, NULL),
(308, 3, 'Hyatt Winnipeg',              '350 St Mary Ave, Winnipeg, MB',      4, 5, NULL);

-- Chain 4: IHG (9 hotels — Ottawa x2)
INSERT INTO Hotel (hotel_ID, chain_ID, name, address, star_cat, num_rooms, manager_ID) VALUES
(401, 4, 'IHG Holiday Inn Ottawa',      '350 Dalhousie St, Ottawa, ON',       3, 6, NULL),
(402, 4, 'IHG Crowne Plaza Ottawa',     '101 Lyon St N, Ottawa, ON',          4, 6, NULL),
(403, 4, 'IHG Holiday Inn Montreal',    '999 St-Urbain, Montreal, QC',        3, 6, NULL),
(404, 4, 'IHG Crowne Plaza Toronto',    '225 Front St W, Toronto, ON',        4, 7, NULL),
(405, 4, 'IHG Vancouver',               '1133 W Hastings, Vancouver, BC',     3, 6, NULL),
(406, 4, 'IHG Calgary',                 '1414 Centre St N, Calgary, AB',      4, 6, NULL),
(407, 4, 'IHG Quebec City',             '3031 Boul Laurier, QC',              3, 5, NULL),
(408, 4, 'IHG Halifax',                 '980 Robie St, Halifax, NS',          4, 5, NULL),
(409, 4, 'IHG Edmonton',                '4440 Gateway Blvd, Edmonton, AB',    2, 5, NULL);

-- Chain 5: Wyndham (8 hotels — Ottawa x1)
INSERT INTO Hotel (hotel_ID, chain_ID, name, address, star_cat, num_rooms, manager_ID) VALUES
(501, 5, 'Wyndham Ottawa Grand',        '240 Sparks St, Ottawa, ON',          3, 6, NULL),
(502, 5, 'Wyndham Montreal',            '360 St-Antoine W, Montreal, QC',     4, 6, NULL),
(503, 5, 'Wyndham Toronto',             '600 King St W, Toronto, ON',         3, 6, NULL),
(504, 5, 'Wyndham Vancouver',           '900 W Georgia St, Vancouver, BC',    4, 6, NULL),
(505, 5, 'Wyndham Calgary',             '320 4 Ave SW, Calgary, AB',          3, 5, NULL),
(506, 5, 'Wyndham Quebec City',         '1225 Boul Lebourgneuf, QC',          2, 5, NULL),
(507, 5, 'Wyndham Halifax',             '1741 Brunswick St, Halifax, NS',     3, 5, NULL),
(508, 5, 'Wyndham Edmonton',            '10010 104 St, Edmonton, AB',         4, 5, NULL);


-- Employees (managers inserted first so we can set manager_ID on Hotel)
INSERT INTO Employee (employee_ID, hotel_ID, name, address, SSN, position) VALUES
(1001, 101, 'Sophie Leblanc',   '5 Rideau St, Ottawa, ON',        'SSN-1001', 'Manager'),
(1002, 102, 'Marc Gauthier',    '12 Vanier Pkwy, Ottawa, ON',     'SSN-1002', 'Manager'),
(1003, 103, 'Chloe Bernard',    '88 Peel St, Montreal, QC',       'SSN-1003', 'Manager'),
(1004, 104, 'Tyler Hudson',     '22 Lakeshore Blvd, Toronto, ON', 'SSN-1004', 'Manager'),
(1005, 105, 'Jasmine Wu',       '345 Robson St, Vancouver, BC',   'SSN-1005', 'Manager'),
(1006, 106, 'Omar Diallo',      '1001 Macleod Tr, Calgary, AB',   'SSN-1006', 'Manager'),
(1007, 107, 'Sylvie Morin',     '40 Rue St-Jean, Quebec City',    'SSN-1007', 'Manager'),
(1008, 108, 'Peter MacNeil',    '200 Barrington St, Halifax, NS', 'SSN-1008', 'Manager'),
(1009, 109, 'Priya Sharma',     '99 Jasper Ave, Edmonton, AB',    'SSN-1009', 'Manager'),
(1010, 110, 'Leo Boychuk',      '300 Main St, Winnipeg, MB',      'SSN-1010', 'Manager'),
(2001, 201, 'Anna Laroche',     '77 Queen St, Ottawa, ON',        'SSN-2001', 'Manager'),
(2002, 202, 'Kevin Dube',       '5 Coventry Rd, Ottawa, ON',      'SSN-2002', 'Manager'),
(2003, 203, 'Manon Tremblay',   '500 Sherbrooke W, Montreal',     'SSN-2003', 'Manager'),
(2004, 204, 'James Park',       '50 Wellington St, Toronto, ON',  'SSN-2004', 'Manager'),
(2005, 205, 'Lisa Chen',        '6000 McKay Ave, Burnaby, BC',    'SSN-2005', 'Manager'),
(2006, 206, 'Rick Olsen',       '200 8 Ave SW, Calgary, AB',      'SSN-2006', 'Manager'),
(2007, 207, 'Danielle Roy',     '200 Grande Allee, Quebec City',  'SSN-2007', 'Manager'),
(2008, 208, 'Sean Murphy',      '1500 Argyle St, Halifax, NS',    'SSN-2008', 'Manager'),
(2009, 209, 'Tanya Fedoruk',    '200 Jasper Ave, Edmonton, AB',   'SSN-2009', 'Manager'),
(3001, 301, 'Maria Ionescu',    '88 Somerset St, Ottawa, ON',     'SSN-3001', 'Manager'),
(3002, 302, 'Jean-Luc Picard',  '3333 Cote-des-Neiges, Montreal','SSN-3002', 'Manager'),
(3003, 303, 'Yuki Sato',        '100 King St W, Toronto, ON',     'SSN-3003', 'Manager'),
(3004, 304, 'Chris Nakamura',   '500 Burrard St, Vancouver, BC',  'SSN-3004', 'Manager'),
(3005, 305, 'Rachel Gould',     '600 Centre St S, Calgary, AB',   'SSN-3005', 'Manager'),
(3006, 306, 'Francois Girard',  '600 Grande Allee E, Quebec',     'SSN-3006', 'Manager'),
(3007, 307, 'Brett MacLean',    '5000 Terminal Rd, Halifax, NS',  'SSN-3007', 'Manager'),
(3008, 308, 'Nina Kowalski',    '250 St Mary Ave, Winnipeg, MB',  'SSN-3008', 'Manager'),
(4001, 401, 'Hugo Lalonde',     '200 Sussex Dr, Ottawa, ON',      'SSN-4001', 'Manager'),
(4002, 402, 'Patricia Cyr',     '99 Lyon St N, Ottawa, ON',       'SSN-4002', 'Manager'),
(4003, 403, 'Samuel Beaulieu',  '800 St-Urbain, Montreal, QC',    'SSN-4003', 'Manager'),
(4004, 404, 'Emma Walsh',       '100 Front St W, Toronto, ON',    'SSN-4004', 'Manager'),
(4005, 405, 'Andrew Ho',        '1000 Hastings, Vancouver, BC',   'SSN-4005', 'Manager'),
(4006, 406, 'Brittany Stone',   '1300 Centre St N, Calgary, AB',  'SSN-4006', 'Manager'),
(4007, 407, 'Rene Caron',       '3000 Boul Laurier, Quebec',      'SSN-4007', 'Manager'),
(4008, 408, 'Sarah Burke',      '900 Robie St, Halifax, NS',      'SSN-4008', 'Manager'),
(4009, 409, 'Tyler Bauer',      '4300 Gateway Blvd, Edmonton',    'SSN-4009', 'Manager'),
(5001, 501, 'Nadia Brossard',   '200 Sparks St, Ottawa, ON',      'SSN-5001', 'Manager'),
(5002, 502, 'Daniel Forget',    '300 St-Antoine W, Montreal',     'SSN-5002', 'Manager'),
(5003, 503, 'Jessica Tang',     '500 King St W, Toronto, ON',     'SSN-5003', 'Manager'),
(5004, 504, 'Michael Scott',    '800 W Georgia St, Vancouver',    'SSN-5004', 'Manager'),
(5005, 505, 'Lauren Voss',      '300 4 Ave SW, Calgary, AB',      'SSN-5005', 'Manager'),
(5006, 506, 'Paul Lavoie',      '1100 Boul Lebourgneuf, Quebec',  'SSN-5006', 'Manager'),
(5007, 507, 'Donna MacPherson', '1700 Brunswick St, Halifax, NS', 'SSN-5007', 'Manager'),
(5008, 508, 'Eric Halvorsen',   '10000 104 St, Edmonton, AB',     'SSN-5008', 'Manager');

-- Additional staff
INSERT INTO Employee (employee_ID, hotel_ID, name, address, SSN, position) VALUES
(1011, 101, 'Tom Archer',   '10 Elgin St, Ottawa, ON',    'SSN-1011', 'Receptionist'),
(1012, 101, 'Sara Benoit',  '22 Slater St, Ottawa, ON',   'SSN-1012', 'Receptionist'),
(1013, 102, 'Paul Hetu',    '40 Donald St, Ottawa, ON',   'SSN-1013', 'Receptionist'),
(2010, 201, 'Fiona Grant',  '60 Metcalfe St, Ottawa, ON', 'SSN-2010', 'Receptionist'),
(3009, 301, 'Derek Osei',   '10 Bronson Ave, Ottawa, ON', 'SSN-3009', 'Receptionist');

-- Assign managers
UPDATE Hotel SET manager_ID = 1001 WHERE hotel_ID = 101;
UPDATE Hotel SET manager_ID = 1002 WHERE hotel_ID = 102;
UPDATE Hotel SET manager_ID = 1003 WHERE hotel_ID = 103;
UPDATE Hotel SET manager_ID = 1004 WHERE hotel_ID = 104;
UPDATE Hotel SET manager_ID = 1005 WHERE hotel_ID = 105;
UPDATE Hotel SET manager_ID = 1006 WHERE hotel_ID = 106;
UPDATE Hotel SET manager_ID = 1007 WHERE hotel_ID = 107;
UPDATE Hotel SET manager_ID = 1008 WHERE hotel_ID = 108;
UPDATE Hotel SET manager_ID = 1009 WHERE hotel_ID = 109;
UPDATE Hotel SET manager_ID = 1010 WHERE hotel_ID = 110;
UPDATE Hotel SET manager_ID = 2001 WHERE hotel_ID = 201;
UPDATE Hotel SET manager_ID = 2002 WHERE hotel_ID = 202;
UPDATE Hotel SET manager_ID = 2003 WHERE hotel_ID = 203;
UPDATE Hotel SET manager_ID = 2004 WHERE hotel_ID = 204;
UPDATE Hotel SET manager_ID = 2005 WHERE hotel_ID = 205;
UPDATE Hotel SET manager_ID = 2006 WHERE hotel_ID = 206;
UPDATE Hotel SET manager_ID = 2007 WHERE hotel_ID = 207;
UPDATE Hotel SET manager_ID = 2008 WHERE hotel_ID = 208;
UPDATE Hotel SET manager_ID = 2009 WHERE hotel_ID = 209;
UPDATE Hotel SET manager_ID = 3001 WHERE hotel_ID = 301;
UPDATE Hotel SET manager_ID = 3002 WHERE hotel_ID = 302;
UPDATE Hotel SET manager_ID = 3003 WHERE hotel_ID = 303;
UPDATE Hotel SET manager_ID = 3004 WHERE hotel_ID = 304;
UPDATE Hotel SET manager_ID = 3005 WHERE hotel_ID = 305;
UPDATE Hotel SET manager_ID = 3006 WHERE hotel_ID = 306;
UPDATE Hotel SET manager_ID = 3007 WHERE hotel_ID = 307;
UPDATE Hotel SET manager_ID = 3008 WHERE hotel_ID = 308;
UPDATE Hotel SET manager_ID = 4001 WHERE hotel_ID = 401;
UPDATE Hotel SET manager_ID = 4002 WHERE hotel_ID = 402;
UPDATE Hotel SET manager_ID = 4003 WHERE hotel_ID = 403;
UPDATE Hotel SET manager_ID = 4004 WHERE hotel_ID = 404;
UPDATE Hotel SET manager_ID = 4005 WHERE hotel_ID = 405;
UPDATE Hotel SET manager_ID = 4006 WHERE hotel_ID = 406;
UPDATE Hotel SET manager_ID = 4007 WHERE hotel_ID = 407;
UPDATE Hotel SET manager_ID = 4008 WHERE hotel_ID = 408;
UPDATE Hotel SET manager_ID = 4009 WHERE hotel_ID = 409;
UPDATE Hotel SET manager_ID = 5001 WHERE hotel_ID = 501;
UPDATE Hotel SET manager_ID = 5002 WHERE hotel_ID = 502;
UPDATE Hotel SET manager_ID = 5003 WHERE hotel_ID = 503;
UPDATE Hotel SET manager_ID = 5004 WHERE hotel_ID = 504;
UPDATE Hotel SET manager_ID = 5005 WHERE hotel_ID = 505;
UPDATE Hotel SET manager_ID = 5006 WHERE hotel_ID = 506;
UPDATE Hotel SET manager_ID = 5007 WHERE hotel_ID = 507;
UPDATE Hotel SET manager_ID = 5008 WHERE hotel_ID = 508;


-- Hotel emails and phones
INSERT INTO HotelEmail VALUES
(101,'ottawa.downtown@marriott.com'),(102,'ottawa.east@marriott.com'),
(103,'montreal@marriott.com'),(104,'toronto@marriott.com'),
(105,'vancouver@marriott.com'),(106,'calgary@marriott.com'),
(107,'quebeccity@marriott.com'),(108,'halifax@marriott.com'),
(109,'edmonton@marriott.com'),(110,'winnipeg@marriott.com'),
(201,'ottawa@hilton.com'),(202,'ottawaairport@hilton.com'),
(203,'montreal@hilton.com'),(204,'toronto@hilton.com'),
(205,'vancouver@hilton.com'),(206,'calgary@hilton.com'),
(207,'quebeccity@hilton.com'),(208,'halifax@hilton.com'),(209,'edmonton@hilton.com'),
(301,'ottawa@hyatt.com'),(302,'montreal@hyatt.com'),(303,'toronto@hyatt.com'),
(304,'vancouver@hyatt.com'),(305,'calgary@hyatt.com'),(306,'quebeccity@hyatt.com'),
(307,'halifax@hyatt.com'),(308,'winnipeg@hyatt.com'),
(401,'ottawa.hi@ihg.com'),(402,'ottawa.cp@ihg.com'),(403,'montreal@ihg.com'),
(404,'toronto@ihg.com'),(405,'vancouver@ihg.com'),(406,'calgary@ihg.com'),
(407,'quebeccity@ihg.com'),(408,'halifax@ihg.com'),(409,'edmonton@ihg.com'),
(501,'ottawa@wyndham.com'),(502,'montreal@wyndham.com'),(503,'toronto@wyndham.com'),
(504,'vancouver@wyndham.com'),(505,'calgary@wyndham.com'),(506,'quebeccity@wyndham.com'),
(507,'halifax@wyndham.com'),(508,'edmonton@wyndham.com');

INSERT INTO HotelPhone VALUES
(101,'613-555-0101'),(102,'613-555-0102'),(103,'514-555-0103'),
(104,'416-555-0104'),(105,'604-555-0105'),(106,'403-555-0106'),
(107,'418-555-0107'),(108,'902-555-0108'),(109,'780-555-0109'),(110,'204-555-0110'),
(201,'613-555-0201'),(202,'613-555-0202'),(203,'514-555-0203'),
(204,'416-555-0204'),(205,'604-555-0205'),(206,'403-555-0206'),
(207,'418-555-0207'),(208,'902-555-0208'),(209,'780-555-0209'),
(301,'613-555-0301'),(302,'514-555-0302'),(303,'416-555-0303'),
(304,'604-555-0304'),(305,'403-555-0305'),(306,'418-555-0306'),
(307,'902-555-0307'),(308,'204-555-0308'),
(401,'613-555-0401'),(402,'613-555-0402'),(403,'514-555-0403'),
(404,'416-555-0404'),(405,'604-555-0405'),(406,'403-555-0406'),
(407,'418-555-0407'),(408,'902-555-0408'),(409,'780-555-0409'),
(501,'613-555-0501'),(502,'514-555-0502'),(503,'416-555-0503'),
(504,'604-555-0504'),(505,'403-555-0505'),(506,'418-555-0506'),
(507,'902-555-0507'),(508,'780-555-0508');


-- Rooms (detailed for key hotels, loop for the rest)
INSERT INTO Room (room_ID, hotel_ID, room_num, capacity, view_type, damaged, extendable, price) VALUES
(10101, 101, 101, 'single',    'none',     FALSE, FALSE, 120.00),
(10102, 101, 102, 'double',    'none',     FALSE, TRUE,  180.00),
(10103, 101, 103, 'double',    'none',     FALSE, FALSE, 175.00),
(10104, 101, 201, 'suite',     'mountain', FALSE, TRUE,  350.00),
(10105, 101, 202, 'triple',    'none',     FALSE, FALSE, 240.00),
(10106, 101, 301, 'single',    'none',     TRUE,  FALSE, 110.00),
(10107, 101, 302, 'king',      'mountain', FALSE, TRUE,  280.00),
(10108, 101, 303, 'double',    'none',     FALSE, TRUE,  190.00),
(10201, 102, 101, 'single',    'none',     FALSE, FALSE,  95.00),
(10202, 102, 102, 'double',    'none',     FALSE, TRUE,  140.00),
(10203, 102, 103, 'double',    'none',     FALSE, FALSE, 135.00),
(10204, 102, 201, 'triple',    'none',     FALSE, FALSE, 195.00),
(10205, 102, 202, 'suite',     'none',     FALSE, TRUE,  260.00),
(10206, 102, 301, 'single',    'none',     FALSE, FALSE,  90.00),
(10207, 102, 302, 'king',      'none',     FALSE, TRUE,  210.00),
(10301, 103, 101, 'single',    'none',     FALSE, FALSE, 200.00),
(10302, 103, 102, 'double',    'none',     FALSE, TRUE,  310.00),
(10303, 103, 103, 'king',      'none',     FALSE, TRUE,  380.00),
(10304, 103, 201, 'suite',     'mountain', FALSE, TRUE,  600.00),
(10305, 103, 202, 'triple',    'none',     FALSE, FALSE, 420.00),
(10306, 103, 301, 'double',    'none',     FALSE, FALSE, 300.00),
(10307, 103, 302, 'penthouse', 'mountain', FALSE, TRUE,  900.00),
(10308, 103, 303, 'single',    'none',     FALSE, FALSE, 190.00),
(20101, 201, 101, 'single',    'none',     FALSE, FALSE, 130.00),
(20102, 201, 102, 'double',    'none',     FALSE, TRUE,  200.00),
(20103, 201, 103, 'double',    'none',     FALSE, FALSE, 195.00),
(20104, 201, 201, 'suite',     'none',     FALSE, TRUE,  370.00),
(20105, 201, 202, 'triple',    'none',     FALSE, FALSE, 255.00),
(20106, 201, 301, 'king',      'none',     FALSE, TRUE,  290.00),
(20107, 201, 302, 'single',    'none',     FALSE, FALSE, 125.00),
(20201, 202, 101, 'single',    'none',     FALSE, FALSE, 100.00),
(20202, 202, 102, 'double',    'none',     FALSE, TRUE,  150.00),
(20203, 202, 103, 'double',    'none',     FALSE, FALSE, 145.00),
(20204, 202, 201, 'suite',     'none',     FALSE, TRUE,  280.00),
(20205, 202, 202, 'triple',    'none',     FALSE, FALSE, 200.00),
(20206, 202, 301, 'king',      'none',     TRUE,  FALSE, 220.00),
(20207, 202, 302, 'single',    'none',     FALSE, FALSE,  98.00),
(30101, 301, 101, 'single',    'none',     FALSE, FALSE, 220.00),
(30102, 301, 102, 'double',    'mountain', FALSE, TRUE,  380.00),
(30103, 301, 103, 'king',      'mountain', FALSE, TRUE,  450.00),
(30104, 301, 201, 'suite',     'mountain', FALSE, TRUE,  700.00),
(30105, 301, 202, 'triple',    'none',     FALSE, FALSE, 480.00),
(30106, 301, 301, 'penthouse', 'mountain', FALSE, TRUE, 1100.00),
(30107, 301, 302, 'double',    'none',     FALSE, FALSE, 360.00),
(40101, 401, 101, 'single',    'none',     FALSE, FALSE,  85.00),
(40102, 401, 102, 'double',    'none',     FALSE, TRUE,  130.00),
(40103, 401, 103, 'double',    'none',     FALSE, FALSE, 125.00),
(40104, 401, 201, 'triple',    'none',     FALSE, FALSE, 175.00),
(40105, 401, 202, 'suite',     'none',     FALSE, TRUE,  240.00),
(40106, 401, 301, 'king',      'none',     FALSE, TRUE,  195.00),
(40107, 401, 302, 'single',    'none',     FALSE, FALSE,  80.00),
(50101, 501, 101, 'single',    'none',     FALSE, FALSE,  88.00),
(50102, 501, 102, 'double',    'none',     FALSE, TRUE,  135.00),
(50103, 501, 103, 'double',    'none',     FALSE, FALSE, 130.00),
(50104, 501, 201, 'triple',    'none',     FALSE, FALSE, 180.00),
(50105, 501, 202, 'suite',     'none',     FALSE, TRUE,  250.00),
(50106, 501, 301, 'king',      'none',     FALSE, TRUE,  200.00),
(50107, 501, 302, 'single',    'none',     FALSE, FALSE,  85.00);

-- Remaining hotels: 5 rooms each
DO $$
DECLARE
    hotel_ids INTEGER[] := ARRAY[104,105,106,107,108,109,110,
                                  203,204,205,206,207,208,209,
                                  302,303,304,305,306,307,308,
                                  402,403,404,405,406,407,408,409,
                                  502,503,504,505,506,507,508];
    hid   INTEGER;
    base  INTEGER;
    prices  DECIMAL[] := ARRAY[120.00, 180.00, 160.00, 240.00, 320.00];
    caps    VARCHAR[] := ARRAY['single','double','double','triple','suite'];
BEGIN
    FOREACH hid IN ARRAY hotel_ids LOOP
        base := hid * 100;
        FOR i IN 1..5 LOOP
            INSERT INTO Room (room_ID, hotel_ID, room_num, capacity, view_type, damaged, extendable, price)
            VALUES (
                base + i,
                hid,
                100 + i,
                caps[i],
                CASE WHEN i = 4 THEN 'mountain' ELSE 'none' END,
                FALSE,
                CASE WHEN i % 2 = 0 THEN TRUE ELSE FALSE END,
                prices[i]
            );
        END LOOP;
    END LOOP;
END $$;


-- Room amenities
INSERT INTO RoomAmenity VALUES
(10101,'WiFi'),(10101,'TV'),(10101,'Air Conditioning'),
(10102,'WiFi'),(10102,'TV'),(10102,'Air Conditioning'),(10102,'Fridge'),
(10103,'WiFi'),(10103,'TV'),(10103,'Air Conditioning'),
(10104,'WiFi'),(10104,'TV'),(10104,'Air Conditioning'),(10104,'Fridge'),(10104,'Jacuzzi'),(10104,'Minibar'),
(10105,'WiFi'),(10105,'TV'),(10105,'Air Conditioning'),(10105,'Fridge'),
(10107,'WiFi'),(10107,'TV'),(10107,'Air Conditioning'),(10107,'Fridge'),(10107,'Minibar'),
(10108,'WiFi'),(10108,'TV'),(10108,'Air Conditioning'),
(20101,'WiFi'),(20101,'TV'),(20101,'Air Conditioning'),
(20102,'WiFi'),(20102,'TV'),(20102,'Air Conditioning'),(20102,'Fridge'),
(30101,'WiFi'),(30101,'TV'),(30101,'Air Conditioning'),
(30104,'WiFi'),(30104,'TV'),(30104,'Air Conditioning'),(30104,'Fridge'),(30104,'Jacuzzi'),(30104,'Minibar'),(30104,'Butler Service');


-- Bookings
INSERT INTO Booking (booking_ID, customer_ID, booking_date, status, "start", "end") VALUES
(1, 1, '2026-03-01', 'completed', '2026-03-10', '2026-03-15'),
(2, 2, '2026-03-05', 'completed', '2026-03-12', '2026-03-14'),
(3, 3, '2026-03-08', 'active',    '2026-04-05', '2026-04-10'),
(4, 4, '2026-03-10', 'active',    '2026-04-08', '2026-04-12'),
(5, 5, '2026-03-15', 'cancelled', '2026-04-01', '2026-04-05'),
(6, 6, '2026-03-20', 'active',    '2026-04-15', '2026-04-20'),
(7, 7, '2026-03-22', 'completed', '2026-03-25', '2026-03-28'),
(8, 8, '2026-03-25', 'active',    '2026-04-20', '2026-04-25');

INSERT INTO ReservedFor VALUES
(10102, 1),(10201, 2),(20102, 3),(30102, 4),
(40102, 5),(50102, 6),(10103, 7),(20103, 8);


-- Rentings
INSERT INTO Renting (renting_ID, customer_ID, room_ID, booking_ID, renting_date, "start", "end") VALUES
(1, 1, 10102, 1,    '2026-03-10', '2026-03-10', '2026-03-15'),
(2, 2, 10201, 2,    '2026-03-12', '2026-03-12', '2026-03-14'),
(3, 7, 10103, 7,    '2026-03-25', '2026-03-25', '2026-03-28'),
(4, 9, 10105, NULL, '2026-03-18', '2026-03-18', '2026-03-20'),
(5,10, 20105, NULL, '2026-03-20', '2026-03-20', '2026-03-22');


-- Payments
INSERT INTO Payment (payment_ID, renting_ID, amount, method, date) VALUES
(1, 1, 540.00, 'credit', '2026-03-15'),
(2, 2, 190.00, 'debit',  '2026-03-14'),
(3, 3, 525.00, 'credit', '2026-03-28'),
(4, 4, 480.00, 'cash',   '2026-03-20'),
(5, 5, 390.00, 'online', '2026-03-22');
