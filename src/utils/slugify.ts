const slugify = (text: string) => {
return text
.toLowerCase()
.replace(/\s+/g, '-') // ganti spasi dengan tanda "-"
.replace(/[^\w-]+/g, '') // hapus karakter selain huruf, angka, dan tanda "-"
.replace(/--+/g, '-') // hindari double dash
.replace(/^-+|-+$/g, '') // hapus dash di awal/akhir
}

export default slugify