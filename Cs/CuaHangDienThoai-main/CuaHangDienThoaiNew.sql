/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2017                    */
/* Created on:     12/25/2024 11:53:51 AM                       */
/*==============================================================*/


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('ChiTietHoaDon') and o.name = 'FK_CHITIETH_CHITIETHO_HOADON')
alter table ChiTietHoaDon
   drop constraint FK_CHITIETH_CHITIETHO_HOADON
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('ChiTietHoaDon') and o.name = 'FK_CHITIETH_CHITIETHO_SANPHAM')
alter table ChiTietHoaDon
   drop constraint FK_CHITIETH_CHITIETHO_SANPHAM
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('ChiTietPhieuNhap') and o.name = 'FK_CHITIETP_CHITIETPH_SANPHAM')
alter table ChiTietPhieuNhap
   drop constraint FK_CHITIETP_CHITIETPH_SANPHAM
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('ChiTietPhieuNhap') and o.name = 'FK_CHITIETP_CHITIETPH_PHIEUNHA')
alter table ChiTietPhieuNhap
   drop constraint FK_CHITIETP_CHITIETPH_PHIEUNHA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CungCap') and o.name = 'FK_CUNGCAP_CUNGCAP_NHACUNGC')
alter table CungCap
   drop constraint FK_CUNGCAP_CUNGCAP_NHACUNGC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('CungCap') and o.name = 'FK_CUNGCAP_CUNGCAP2_SANPHAM')
alter table CungCap
   drop constraint FK_CUNGCAP_CUNGCAP2_SANPHAM
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('HoaDon') and o.name = 'FK_HOADON_CO_KHACHHAN')
alter table HoaDon
   drop constraint FK_HOADON_CO_KHACHHAN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('HoaDon') and o.name = 'FK_HOADON_LAP_NHANVIEN')
alter table HoaDon
   drop constraint FK_HOADON_LAP_NHANVIEN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('KhachHang') and o.name = 'FK_KHACHHAN_CUA_TAIKHOAN')
alter table KhachHang
   drop constraint FK_KHACHHAN_CUA_TAIKHOAN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('NhanVien') and o.name = 'FK_NHANVIEN_THUOC_TAIKHOAN')
alter table NhanVien
   drop constraint FK_NHANVIEN_THUOC_TAIKHOAN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('PhieuNhap') and o.name = 'FK_PHIEUNHA_CAP_NHACUNGC')
alter table PhieuNhap
   drop constraint FK_PHIEUNHA_CAP_NHACUNGC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('PhieuNhap') and o.name = 'FK_PHIEUNHA_SECO_NHANVIEN')
alter table PhieuNhap
   drop constraint FK_PHIEUNHA_SECO_NHANVIEN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('SanPham') and o.name = 'FK_SANPHAM_SANXUAT_HANGSANX')
alter table SanPham
   drop constraint FK_SANPHAM_SANXUAT_HANGSANX
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TaiKhoan') and o.name = 'FK_TAIKHOAN_CUA2_KHACHHAN')
alter table TaiKhoan
   drop constraint FK_TAIKHOAN_CUA2_KHACHHAN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('TaiKhoan') and o.name = 'FK_TAIKHOAN_THUOC2_NHANVIEN')
alter table TaiKhoan
   drop constraint FK_TAIKHOAN_THUOC2_NHANVIEN
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('ChiTietHoaDon')
            and   name  = 'ChiTietHoaDon2_FK'
            and   indid > 0
            and   indid < 255)
   drop index ChiTietHoaDon.ChiTietHoaDon2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('ChiTietHoaDon')
            and   name  = 'ChiTietHoaDon_FK'
            and   indid > 0
            and   indid < 255)
   drop index ChiTietHoaDon.ChiTietHoaDon_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('ChiTietHoaDon')
            and   type = 'U')
   drop table ChiTietHoaDon
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('ChiTietPhieuNhap')
            and   name  = 'ChiTietPhieuNhap2_FK'
            and   indid > 0
            and   indid < 255)
   drop index ChiTietPhieuNhap.ChiTietPhieuNhap2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('ChiTietPhieuNhap')
            and   name  = 'ChiTietPhieuNhap_FK'
            and   indid > 0
            and   indid < 255)
   drop index ChiTietPhieuNhap.ChiTietPhieuNhap_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('ChiTietPhieuNhap')
            and   type = 'U')
   drop table ChiTietPhieuNhap
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('CungCap')
            and   name  = 'CungCap2_FK'
            and   indid > 0
            and   indid < 255)
   drop index CungCap.CungCap2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('CungCap')
            and   name  = 'CungCap_FK'
            and   indid > 0
            and   indid < 255)
   drop index CungCap.CungCap_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CungCap')
            and   type = 'U')
   drop table CungCap
go

if exists (select 1
            from  sysobjects
           where  id = object_id('HangSanXuat')
            and   type = 'U')
   drop table HangSanXuat
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('HoaDon')
            and   name  = 'lap_FK'
            and   indid > 0
            and   indid < 255)
   drop index HoaDon.lap_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('HoaDon')
            and   name  = 'co_FK'
            and   indid > 0
            and   indid < 255)
   drop index HoaDon.co_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('HoaDon')
            and   type = 'U')
   drop table HoaDon
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('KhachHang')
            and   name  = 'cua_FK'
            and   indid > 0
            and   indid < 255)
   drop index KhachHang.cua_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('KhachHang')
            and   type = 'U')
   drop table KhachHang
go

if exists (select 1
            from  sysobjects
           where  id = object_id('NhaCungCap')
            and   type = 'U')
   drop table NhaCungCap
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('NhanVien')
            and   name  = 'thuoc_FK'
            and   indid > 0
            and   indid < 255)
   drop index NhanVien.thuoc_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('NhanVien')
            and   type = 'U')
   drop table NhanVien
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('PhieuNhap')
            and   name  = 'seco_FK'
            and   indid > 0
            and   indid < 255)
   drop index PhieuNhap.seco_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('PhieuNhap')
            and   name  = 'cap_FK'
            and   indid > 0
            and   indid < 255)
   drop index PhieuNhap.cap_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PhieuNhap')
            and   type = 'U')
   drop table PhieuNhap
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('SanPham')
            and   name  = 'sanxuat_FK'
            and   indid > 0
            and   indid < 255)
   drop index SanPham.sanxuat_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('SanPham')
            and   type = 'U')
   drop table SanPham
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('TaiKhoan')
            and   name  = 'cua2_FK'
            and   indid > 0
            and   indid < 255)
   drop index TaiKhoan.cua2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('TaiKhoan')
            and   name  = 'thuoc2_FK'
            and   indid > 0
            and   indid < 255)
   drop index TaiKhoan.thuoc2_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TaiKhoan')
            and   type = 'U')
   drop table TaiKhoan
go

/*==============================================================*/
/* Table: ChiTietHoaDon                                         */
/*==============================================================*/
create table ChiTietHoaDon (
   MaHoaDon             varchar(10)          not null,
   MaSanPham            varchar(10)          not null,
   SoLuong              int                  null,
   DonGia               float                null,
   ThanhTien            float                null,
   constraint PK_CHITIETHOADON primary key (MaHoaDon, MaSanPham)
)
go

/*==============================================================*/
/* Index: ChiTietHoaDon_FK                                      */
/*==============================================================*/




create nonclustered index ChiTietHoaDon_FK on ChiTietHoaDon (MaHoaDon ASC)
go

/*==============================================================*/
/* Index: ChiTietHoaDon2_FK                                     */
/*==============================================================*/




create nonclustered index ChiTietHoaDon2_FK on ChiTietHoaDon (MaSanPham ASC)
go

/*==============================================================*/
/* Table: ChiTietPhieuNhap                                      */
/*==============================================================*/
create table ChiTietPhieuNhap (
   MaSanPham            varchar(10)          not null,
   MaPhieuNhap          varchar(10)          not null,
   SoLuong              int                  null,
   DonGia               float                null,
   ThanhTien            float                null,
   constraint PK_CHITIETPHIEUNHAP primary key (MaSanPham, MaPhieuNhap)
)
go

/*==============================================================*/
/* Index: ChiTietPhieuNhap_FK                                   */
/*==============================================================*/




create nonclustered index ChiTietPhieuNhap_FK on ChiTietPhieuNhap (MaSanPham ASC)
go

/*==============================================================*/
/* Index: ChiTietPhieuNhap2_FK                                  */
/*==============================================================*/




create nonclustered index ChiTietPhieuNhap2_FK on ChiTietPhieuNhap (MaPhieuNhap ASC)
go

/*==============================================================*/
/* Table: CungCap                                               */
/*==============================================================*/
create table CungCap (
   MaNhaCungCap         varchar(10)          not null,
   MaSanPham            varchar(10)          not null,
   NgayCungCap          datetime             null,
   GiaNhap              float                null,
   constraint PK_CUNGCAP primary key (MaNhaCungCap, MaSanPham)
)
go

/*==============================================================*/
/* Index: CungCap_FK                                            */
/*==============================================================*/




create nonclustered index CungCap_FK on CungCap (MaNhaCungCap ASC)
go

/*==============================================================*/
/* Index: CungCap2_FK                                           */
/*==============================================================*/




create nonclustered index CungCap2_FK on CungCap (MaSanPham ASC)
go

/*==============================================================*/
/* Table: HangSanXuat                                           */
/*==============================================================*/
create table HangSanXuat (
   MaHang               varchar(10)          not null,
   TenHang              varchar(100)         null,
   constraint PK_HANGSANXUAT primary key (MaHang)
)
go

/*==============================================================*/
/* Table: HoaDon                                                */
/*==============================================================*/
create table HoaDon (
   MaHoaDon             varchar(10)          not null,
   MaKhachHang          varchar(10)          not null,
   MaNhanVien           varchar(10)          not null,
   NgayLap              datetime             null,
   TongTien             float                null,
   PhuongThucThanhToan  varchar(50)          null,
   TrangThaiDonHang     varchar(50)          null,
   constraint PK_HOADON primary key (MaHoaDon)
)
go

/*==============================================================*/
/* Index: co_FK                                                 */
/*==============================================================*/




create nonclustered index co_FK on HoaDon (MaKhachHang ASC)
go

/*==============================================================*/
/* Index: lap_FK                                                */
/*==============================================================*/




create nonclustered index lap_FK on HoaDon (MaNhanVien ASC)
go

/*==============================================================*/
/* Table: KhachHang                                             */
/*==============================================================*/
create table KhachHang (
   MaKhachHang          varchar(10)          not null,
   TenTaiKhoan          varchar(50)          null,
   TenKhachHang         varchar(100)         null,
   DiaChi               varchar(255)         null,
   SoDienThoai          varchar(15)          null,
   Email                varchar(100)         null,
   constraint PK_KHACHHANG primary key (MaKhachHang)
)
go

/*==============================================================*/
/* Index: cua_FK                                                */
/*==============================================================*/




create nonclustered index cua_FK on KhachHang (TenTaiKhoan ASC)
go

/*==============================================================*/
/* Table: NhaCungCap                                            */
/*==============================================================*/
create table NhaCungCap (
   MaNhaCungCap         varchar(10)          not null,
   TenNhaCungCap        varchar(100)         null,
   DiaChi               varchar(255)         null,
   SoDienThoai          varchar(15)          null,
   Email                varchar(100)         null,
   constraint PK_NHACUNGCAP primary key (MaNhaCungCap)
)
go

/*==============================================================*/
/* Table: NhanVien                                              */
/*==============================================================*/
create table NhanVien (
   MaNhanVien           varchar(10)          not null,
   TenTaiKhoan          varchar(50)          null,
   TenNhanVien          varchar(100)         null,
   DiaChi               varchar(255)         null,
   SoDienThoai          varchar(15)          null,
   Email                varchar(100)         null,
   ChucVu               varchar(50)          null,
   constraint PK_NHANVIEN primary key (MaNhanVien)
)
go

/*==============================================================*/
/* Index: thuoc_FK                                              */
/*==============================================================*/




create nonclustered index thuoc_FK on NhanVien (TenTaiKhoan ASC)
go

/*==============================================================*/
/* Table: PhieuNhap                                             */
/*==============================================================*/
create table PhieuNhap (
   MaPhieuNhap          varchar(10)          not null,
   MaNhanVien           varchar(10)          not null,
   MaNhaCungCap         varchar(10)          not null,
   NgayNhap             datetime             null,
   TongTien             float                null,
   constraint PK_PHIEUNHAP primary key (MaPhieuNhap)
)
go

/*==============================================================*/
/* Index: cap_FK                                                */
/*==============================================================*/




create nonclustered index cap_FK on PhieuNhap (MaNhaCungCap ASC)
go

/*==============================================================*/
/* Index: seco_FK                                               */
/*==============================================================*/




create nonclustered index seco_FK on PhieuNhap (MaNhanVien ASC)
go

/*==============================================================*/
/* Table: SanPham                                               */
/*==============================================================*/
create table SanPham (
   MaSanPham            varchar(10)          not null,
   MaHang               varchar(10)          not null,
   TenSanPham           varchar(100)         null,
   MoTa                 varchar(500)         null,
   GiaBan               float                null,
   SoLuongTonKho        int                  null,
   MauSac               varchar(50)          null,
   DungLuong            varchar(20)          null,
   HeDieuHanh           varchar(50)          null,
   KichThuocManHinh     varchar(20)          null,
   constraint PK_SANPHAM primary key (MaSanPham)
)
go

/*==============================================================*/
/* Index: sanxuat_FK                                            */
/*==============================================================*/




create nonclustered index sanxuat_FK on SanPham (MaHang ASC)
go

/*==============================================================*/
/* Table: TaiKhoan                                              */
/*==============================================================*/
create table TaiKhoan (
   TenTaiKhoan          varchar(50)          not null,
   MaKhachHang          varchar(10)          not null,
   MaNhanVien           varchar(10)          not null,
   MatKhau              varchar(50)          null,
   LoaiTaiKhoan         varchar(50)          null,
   constraint PK_TAIKHOAN primary key (TenTaiKhoan)
)
go

/*==============================================================*/
/* Index: thuoc2_FK                                             */
/*==============================================================*/




create nonclustered index thuoc2_FK on TaiKhoan (MaNhanVien ASC)
go

/*==============================================================*/
/* Index: cua2_FK                                               */
/*==============================================================*/




create nonclustered index cua2_FK on TaiKhoan (MaKhachHang ASC)
go

alter table ChiTietHoaDon
   add constraint FK_CHITIETH_CHITIETHO_HOADON foreign key (MaHoaDon)
      references HoaDon (MaHoaDon)
go

alter table ChiTietHoaDon
   add constraint FK_CHITIETH_CHITIETHO_SANPHAM foreign key (MaSanPham)
      references SanPham (MaSanPham)
go

alter table ChiTietPhieuNhap
   add constraint FK_CHITIETP_CHITIETPH_SANPHAM foreign key (MaSanPham)
      references SanPham (MaSanPham)
go

alter table ChiTietPhieuNhap
   add constraint FK_CHITIETP_CHITIETPH_PHIEUNHA foreign key (MaPhieuNhap)
      references PhieuNhap (MaPhieuNhap)
go

alter table CungCap
   add constraint FK_CUNGCAP_CUNGCAP_NHACUNGC foreign key (MaNhaCungCap)
      references NhaCungCap (MaNhaCungCap)
go

alter table CungCap
   add constraint FK_CUNGCAP_CUNGCAP2_SANPHAM foreign key (MaSanPham)
      references SanPham (MaSanPham)
go

alter table HoaDon
   add constraint FK_HOADON_CO_KHACHHAN foreign key (MaKhachHang)
      references KhachHang (MaKhachHang)
go

alter table HoaDon
   add constraint FK_HOADON_LAP_NHANVIEN foreign key (MaNhanVien)
      references NhanVien (MaNhanVien)
go

alter table KhachHang
   add constraint FK_KHACHHAN_CUA_TAIKHOAN foreign key (TenTaiKhoan)
      references TaiKhoan (TenTaiKhoan)
go

alter table NhanVien
   add constraint FK_NHANVIEN_THUOC_TAIKHOAN foreign key (TenTaiKhoan)
      references TaiKhoan (TenTaiKhoan)
go

alter table PhieuNhap
   add constraint FK_PHIEUNHA_CAP_NHACUNGC foreign key (MaNhaCungCap)
      references NhaCungCap (MaNhaCungCap)
go

alter table PhieuNhap
   add constraint FK_PHIEUNHA_SECO_NHANVIEN foreign key (MaNhanVien)
      references NhanVien (MaNhanVien)
go

alter table SanPham
   add constraint FK_SANPHAM_SANXUAT_HANGSANX foreign key (MaHang)
      references HangSanXuat (MaHang)
go

alter table TaiKhoan
   add constraint FK_TAIKHOAN_CUA2_KHACHHAN foreign key (MaKhachHang)
      references KhachHang (MaKhachHang)
go

alter table TaiKhoan
   add constraint FK_TAIKHOAN_THUOC2_NHANVIEN foreign key (MaNhanVien)
      references NhanVien (MaNhanVien)
go

