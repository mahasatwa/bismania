
export interface LayoutItem {
  id: string; 
  type: 'seat' | 'aisle' | 'empty' | 'door';
  seatNumber?: string;
  text?: string;
}

export const BUS_SEATING_CAPACITY = 55; // This seems to be the number of regular seats from the layout

export const OCR_TEXT = `
DAFTAR PESERTA KUNJUNGAN INDUSTRI 
BURSA EFEK INDONESIA (IDX) - JAKARTA
18 Juli 2025
SEKOLAH TINGGI ILMU EKONOMI DWIMULYA

DAFTAR MAHASISWA PESERTA

No.	NIM	NAMA	PROGRAM STUDI (SEMESTER)
1	2131231966	M. ILHAM ARIFIN	S1 MANAJEMEN (IV)
2	2231231962	SITI LAELA NORHIKMAH	S1 MANAJEMEN (IV)
3	2231231968	RAHMA AINUNNISA		S1 MANAJEMEN (IV)
4	2231211552	HERNAWATI		S1 MANAJEMEN (VIII)
5	2231232056	INDAH		S1 MANAJEMEN (IV)
6	1231231950	SITI NURAENI		S1 AKUNTANSI (IV)
7	1231231990	MIA AULIAH	S1 AKUNTANSI (IV)
8	2131232005	RANGGA ADRIANSYAH		S1 MANAJEMEN (IV)
9	2231231988	SELLA AULIA		S1 MANAJEMEN (IV)
10	1131231992	MUHAMMAD AL FARIZI		S1 AKUNTANSI (IV)
11	1231242148	DASKINAH		S1 AKUNTANSI (II)
12	2131232002	DIMAS FARHAN DWI PURNAMA	S1 MANAJEMEN (IV)
13	2131231976	MOCHAMAD JAENURI		S1 MANAJEMEN (IV)
14	1231242142	RIHLATUL KUZZIA		S1 AKUNTANSI (II)
15	1231242144	KONITA AGIL LUTFIAH	S1 AKUNTANSI (II)
16	2231242123	AINUL MARDIA WATTIMENA	S1 AKUNTANSI (II)
17	1231242146	DEWI SARAH	S1 AKUNTANSI (II)
18	1231242143	HUSNUN NADIA	S1 AKUNTANSI (II)
19	2231242126	SUSILAWATI	S1 MANAJEMEN (II)
20	2231242124	TIAS YASPIA	S1 MANAJEMEN (II)
21	2231242125	NURAENI	S1 AKUNTANSI (II)
22	1131242152	AJRIL ANWAR	S1 AKUNTANSI (II)
23	1131242151	TOPAN AZIZ	S1 AKUNTANSI (II)
24	1131242153	MUHAMAD SAEPUDIN		S1 AKUNTANSI (II)
25	1231242147	ANISAH	S1 AKUNTANSI (II)
26	2231231949	RISMA YULIANTI	S1 MANAJEMEN (IV)
27	2231231973	ANITA SARI	S1 MANAJEMEN (IV)
28	2231231971	SITI KHODIJAH RIZQYAH	S1 MANAJEMEN (IV)
29	2231231948	RINA ROSDIANA		S1 MANAJEMEN (IV)
30	2231231947	VADILA VATRIATUN NADA		S1 MANAJEMEN (IV)
31	2231231961	UPI LUTFIAH		S1 MANAJEMEN (IV)
32	1231231993	NABILA NURSYIFA		S1 AKUNTANSI (IV)
33	2131231946	SANDY SURYA ARDHI	S1 MANAJEMEN (IV)
34	2231221737	SOLEHA	S1 MANAJEMEN (VI)
35	2231221735	NOPITASARI	S1 MANAJEMEN (VI)
36	2231221738	IMELDA HARTANTI	S1 MANAJEMEN (VI)
37	2231221734	ANWALIAH	S1 MANAJEMEN (VI)
38	2231221739	RIMA YUNIZAR	S1 MANAJEMEN (VI)
39	2131221731	ALVAN ALIADI		S1 MANAJEMEN (VI)
40	2131221732	RUDAL FAHRUDIN		S1 MANAJEMEN (VI)
41	2131221776	SARIPUDIN		S1 MANAJEMEN (VI)
42	2231221756	DIANITA PRATIWI		S1 MANAJEMEN (VI)
43	2131221733	M. HASANUDIN	S1 MANAJEMEN (VI)
44	2231221736	SITI NURHAYATI	S1 MANAJEMEN (VI)
45	2231221740	LIA AMALIA	S1 MANAJEMEN (VI)
46	2231242127	ALIFAH SITI ZAHRAH	S1 MANAJEMEN (II)
47	2131231945	AKHMAD QUSYAIRI	S1 MANAJEMEN (IV)
48	2131231959	FURKON	S1 MANAJEMEN (IV)
49	2231231982	HENI ROHAENI	S1 MANAJEMEN (IV)
50	1131221801	MOH RIZKI SAPUTRA	S1 AKUNTANSI (VI)
51	2231231951	NADIAWATI	S1 MANAJEMEN (IV)
52	1231231997	ANNISA DZULLIANA	S1 AKUNTANSI (IV)
53	1131231994	ARIS PURWANTO	S1 AKUNTANSI (VI)
54	2131231963	MISBAHUL MUNIR	S1 MANAJEMEN (VI)
55	2132242198	RENO BINTANG PRATAMA	S1 MANAJEMEN (VI)
56	21312211808	HUMAEDI	S1 MANAJEMEN (VI)
57	1231221751	TRIA JULIANI SADINO		S1 AKUNTANSI (VI)
58	2131231983	ANDHYKA FREDY SASMITO	S1 MANAJEMEN (IV)
59	2232242197	MASAYU AHBANTANI RENAZSYA	S1 MANAJEMEN (IV)
60	2131221775	ABDUL ROHMAN	S1 MANAJEMEN (VI)
61	2131242183	SIROJUL ASY'ARI	S1 MANAJEMEN (II)
62	2231231952	KIKI SRI UTARI		S1 MANAJEMEN (IV)
63	2231231967	NIDA MAULIDA	S1 MANAJEMEN (IV)
64	1231221899	AYU TRY LESTARI		S1 AKUNTANSI (VI)
65	2131242132	MUHAMAD DONI	S1 MANAJEMEN (II)
66	1231221902	SELA ROHMAWATI	S1 AKUNTANSI (VI)
67	1231221746	NURUL IMAH	S1 AKUNTANSI (VI)
68	2231221784	TIA LESTARI	S1 MANAJEMEN (VI)
69	2231221791	MARTYAH YULISTINA	S1 MANAJEMEN (VI)
70	2131221778	MUHAMAD HARTONO		S1 MANAJEMEN (VI)
71	2131221787	DARNA SAPUTRA		S1 MANAJEMEN (VI)
72	2131221786	HAFIZ RASPATI RAFADILAH	S1 MANAJEMEN (VI)
73	2131232081	M. ILHAM SURYA KESUMA	S1 MANAJEMEN (IV)
74	1231221893	ANISA NURTRIANI	S1 AKUNTANSI (VI)
75	2131232007	ATU HAYATUN TOYIBAH	S1 MANAJEMEN (IV)
76	2131232000	ZULIZAR BERIZKI		S1 MANAJEMEN (IV)
77	2231221794	LARAS AZIZAH PRATIWI	S1 MANAJEMEN (VI)
78	2131232086	DADAN DANU HERMAWAN	S1 MANAJEMEN (IV)
79	1231221749	SUNENGSIH	S1 AKUNTANSI (VI)
80	2231221803	ULIAH FITROTI		S1 MANAJEMEN (VI)
81	2231231975	IKA MALINDA	S1 MANAJEMEN (IV)
82	1231231995	SRI AGUSTIYANI	S1 AKUNTANSI (IV)
83	2131232003	KHOIRUL UMAM	S1 MANAJEMEN (IV)
84	1231221895	DELA AGUSTINA	S1 AKUNTANSI (VI)
85	2231221905	HAFIFAH	S1 MANAJEMEN (VI)
86	2231231985	LIDYA SHAHARANI	S1 MANAJEMEN (IV)
87	2231221799	SRI DEWI RACHMAWATI	S1 MANAJEMEN (VI)
88	2231221928	RIZKIA NOVIANTI	S1 MANAJEMEN (VI)
89	2231221761	NAYA DWI FAUZIYAH	S1 MANAJEMEN (VI)
90	1231221930	ANISA MULYANI	S1 AKUNTANSI (VI)
91	2231221802	SITI JULAEHA	S1 MANAJEMEN (VI)
92	2231242137	DADAY HIDAYAT	S1 MANAJEMEN (II)
93	2131211619	ARIF ARRIZQI	S1 MANAJEMEN (VIII)
94	2131231972	MUHAMMAD AFRIZAL	S1 MANAJEMEN (IV)

DAFTAR DOSEN PENDAMPING

No.	NUPTK	NAMA	HOMEBASE
1	0059771672130333	SUHERI, S.M., M.M.	S1 MANAJEMEN
2	4659766667130142	EMAN DIANTORO, S.M., M.M.	S1 MANAJEMEN
3	1941770671130362	AGUS GUNAWAN, S.Akun., M.E.	S1 AKUNTANSI
4	3237747648130123	FADJAR MULIAWAN, S.E., M.M.	S1 MANAJEMEN
5	5146754656300003	SUNINGRAT, S.E., M.Pd.	S1 AKUNTANSI
6	5344762663230273	TITA OKTAVIANI, S.E., M.M.	S1 MANAJEMEN
7	2855762663230262	YAYUK KARLIENA, S.E., M.M.	S1 MANAJEMEN

DAFTAR ASISTEN TEKNIS

No.	NAMA	BAGIAN
1	ISMI	DOKUMENTASI
2	AZIMI FAQQIHUDDIN ARSYAD	DOKUMENTASI
`;

const generateLayout = (): LayoutItem[] => {
  const layout: LayoutItem[] = [];

  // Front Door
  layout.push({ id: 'front-door', type: 'door', text: 'Pintu Depan' });

  // Rows 1-10 (2 seats, aisle, 3 seats)
  for (let row = 1; row <= 10; row++) {
    layout.push({ id: `${row}A`, type: 'seat', seatNumber: `${row}A` });
    layout.push({ id: `${row}B`, type: 'seat', seatNumber: `${row}B` });
    layout.push({ id: `aisle-${row}`, type: 'aisle' });
    layout.push({ id: `${row}C`, type: 'seat', seatNumber: `${row}C` });
    layout.push({ id: `${row}D`, type: 'seat', seatNumber: `${row}D` });
    layout.push({ id: `${row}E`, type: 'seat', seatNumber: `${row}E` });
  }

  // Back Door
  layout.push({ id: 'back-door', type: 'door', text: 'Pintu Belakang' });

  // Row 11 (3 seats: C, D, E)
  layout.push({ id: `empty-11-A`, type: 'empty' });
  layout.push({ id: `empty-11-B`, type: 'empty' });
  layout.push({ id: `aisle-11`, type: 'aisle' });
  layout.push({ id: `11C`, type: 'seat', seatNumber: `11C` });
  layout.push({ id: `11D`, type: 'seat', seatNumber: `11D` });
  layout.push({ id: `11E`, type: 'seat', seatNumber: `11E` });

  // Row 12 (6 seats: A, B, BC, C, D, E)
  layout.push({ id: '12A', type: 'seat', seatNumber: '12A' });
  layout.push({ id: '12B', type: 'seat', seatNumber: '12B' });
  layout.push({ id: '12BC', type: 'seat', seatNumber: '12BC' });
  layout.push({ id: '12C', type: 'seat', seatNumber: '12C' });
  layout.push({ id: '12D', type: 'seat', seatNumber: '12D' });
  layout.push({ id: '12E', type: 'seat', seatNumber: '12E' });


  return layout;
};

export const BUS_LAYOUT: LayoutItem[] = generateLayout();
