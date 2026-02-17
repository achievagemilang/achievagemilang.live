import { Dictionary } from './en';

export const id: Dictionary = {
  nav: {
    home: 'Beranda',
    about: 'Tentang',
    projects: 'Proyek',
    blog: 'Tulisan',
  },
  hero: {
    greeting: 'Hi, aku',
    role: 'Software Engineer',
    description:
      'Seorang **Software Engineer** dan pembelajar seumur hidup, dengan pola pikir berbasis produk, memadukan keahlian teknis dengan pemikiran strategis bisnis.',
    cta: 'Lihat Karya Saya',
    contact: 'Hubungi Saya',
    about: 'Tentang Saya',
    resume: 'Resume',
  },
  home: {
    hero: {
      resume: 'Resume',
    },
    experience: {
      title: 'Pengalaman',
      professional: 'Profesional',
      work: 'Kerja',
      education: 'Pendidikan',
      edu: 'Pendidikan',
      volunteer: 'Org/Sukarelawan',
      org: 'Sukarelawan',
      present: 'Sekarang',
      visitWebsite: 'Kunjungi Website',
      showMore: 'Lihat {count} Lagi',
      collapseAll: 'Tutup Semua',
    },
    projects: {
      title: 'Proyek Unggulan',
      viewAll: 'Lihat Semua Proyek',
    },
    blog: {
      title: 'Tulisan Terbaru',
      viewAll: 'Lihat Semua Tulisan',
    },
  },
  notFound: {
    title: 'Halaman Tidak Ditemukan',
    description:
      'Oops! Halaman yang Anda cari sepertinya telah hilang ke dalam kehampaan digital. Mari kita kembalikan Anda ke jalur yang benar.',
    goHome: 'Ke Beranda',
    browseBlog: 'Lihat Blog',
    goBack: 'Kembali',
  },
  footer: {
    rights: 'Hak cipta dilindungi undang-undang.',
    builtWith: 'Dibuat dengan Next.js dan Tailwind CSS',
  },
  about: {
    bento: {
      profile: {
        greeting: 'Halo, Cip di sini!',
        role: 'Software Engineer',
        socials: 'Sosial',
        resume: 'Resume',
      },
      mission: {
        title: 'Misi Saya',
        descriptionPart1:
          'Saya memadukan keahlian teknis dengan pemikiran strategis untuk membangun solusi yang skalabel dan berpusat pada pengguna. Saat ini terpikat oleh ',
        descriptionHighlight: 'AI Agents',
        descriptionPart2: ' dan membangun produk generasi berikutnya.',
      },
      techStack: {
        title: 'Teknologi',
      },
      learner: {
        title: 'Pembelajar Seumur Hidup',
        description:
          'Saya percaya pada belajar di depan umum dan berkontribusi kembali kepada komunitas. Mendokumentasikan kegagalan dan kesuksesan untuk membantu orang lain berkembang.',
        writing: 'Menulis',
        sharing: 'Berbagi',
        growing: 'Bertumbuh',
      },
      hobbies: {
        title: 'Di Luar Coding',
        gaming: 'Ngegame',
        reading: 'Membaca',
        gym: 'Olahraga',
      },
      contact: {
        title: 'Mari Bicara!',
        subtitle: 'Terbuka untuk peluang',
      },
    },
    contactForm: {
      title: 'Hubungi Saya',
      descriptionPart1: 'Hubungi saya melalui email atau LinkedIn.',
      descriptionPart2: 'Saya akan menghubungi Anda sesegera mungkin.',
      email: 'Email Saya',
      linkedin: 'LinkedIn',
    },
  },
  blog: {
    title: 'Semua Tulisan',
    search: {
      placeholderWrites: 'Cari tulisan...',
      placeholderProjects: 'Cari proyek...',
    },
    filter: {
      year: 'Tahun',
      filterByYear: 'Filter berdasarkan Tahun',
      clearFilters: 'Hapus Filter',
    },
    empty: {
      noWrites: 'Tidak ada tulisan yang ditemukan sesuai kriteria Anda.',
      loading: 'Memuat tulisan...',
    },
    pagination: {
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
    },
    card: {
      minRead: 'menit baca',
      readMore: 'Baca Selengkapnya',
    },
    related: {
      title: 'Baca Juga',
    },
  },
  project: {
    title: 'Semua Proyek',
    filter: {
      year: 'Tahun',
      filterByYear: 'Filter berdasarkan Tahun',
      techStack: 'Teknologi',
      filterByTechStack: 'Filter berdasarkan Teknologi',
      clear: 'Hapus',
      clearFilters: 'Hapus Filter',
    },
    empty: {
      noProjects: 'Tidak ada proyek yang ditemukan sesuai kriteria Anda.',
      loading: 'Memuat proyek...',
    },
    pagination: {
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
    },
    card: {
      viewDetails: 'Lihat Detail',
      visitProject: 'Kunjungi Proyek',
      less: 'Lebih Sedikit',
      showMore: 'Lihat semua {count} teknologi',
      showLess: 'Lihat lebih sedikit',
    },
    related: {
      title: 'Baca Juga',
    },
    detail: {
      author: 'Penulis',
      visitProject: 'Kunjungi Proyek',
    },
  },
  newsletter: {
    heading: 'Tetap Update',
    description: 'Dapatkan tulisan terbaru langsung ke inbox Anda.',
    placeholder: 'email@anda.com',
    subscribe: 'Berlangganan',
    subscribing: 'Berlangganan...',
    success: 'Cek email Anda untuk konfirmasi langganan!',
    alreadySubscribed: 'Anda sudah berlangganan!',
    error: 'Terjadi kesalahan. Silakan coba lagi.',
    rateLimited: 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
    status: {
      confirmed: {
        title: 'Langganan Dikonfirmasi!',
        message: 'Selamat datang! Anda akan menerima tulisan terbaru di inbox Anda.',
      },
      unsubscribed: {
        title: 'Berhenti Berlangganan',
        message: 'Anda telah dihapus dari mailing list.',
      },
      error: {
        title: 'Terjadi Kesalahan',
        message: 'Silakan coba lagi atau hubungi kami jika masalah berlanjut.',
      },
      goToBlog: 'Ke Halaman Blog',
    },
  },
};
