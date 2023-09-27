USE [master]
GO
/****** Object:  Database [ShoeGalaxy]    Script Date: 9/19/2023 9:39:01 PM ******/
CREATE DATABASE [ShoeGalaxy]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ShoeGalaxy', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\ShoeGalaxy.mdf' , SIZE = 3264KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'ShoeGalaxy_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\ShoeGalaxy_log.ldf' , SIZE = 816KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [ShoeGalaxy] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ShoeGalaxy].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ShoeGalaxy] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET ARITHABORT OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ShoeGalaxy] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ShoeGalaxy] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET  ENABLE_BROKER 
GO
ALTER DATABASE [ShoeGalaxy] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ShoeGalaxy] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET RECOVERY FULL 
GO
ALTER DATABASE [ShoeGalaxy] SET  MULTI_USER 
GO
ALTER DATABASE [ShoeGalaxy] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ShoeGalaxy] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ShoeGalaxy] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ShoeGalaxy] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [ShoeGalaxy] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'ShoeGalaxy', N'ON'
GO
USE [ShoeGalaxy]
GO
/****** Object:  Table [dbo].[Accounts]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Accounts](
	[username] [nvarchar](50) NOT NULL,
	[password] [nvarchar](50) NOT NULL,
	[fullname] [nvarchar](50) NOT NULL,
	[email] [nvarchar](50) NOT NULL,
	[photo] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Authorities]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Authorities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](50) NOT NULL,
	[roleId] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Categories](
	[id] [char](4) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[discount_codes]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[discount_codes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](255) NOT NULL,
	[discount_amount] [decimal](10, 2) NOT NULL,
	[expiration_date] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[discount_Sales]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[discount_Sales](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[start_date] [date] NOT NULL,
	[end_date] [date] NOT NULL,
	[percentage] [float] NOT NULL,
	[activate] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[order_id] [bigint] NULL,
	[product_id] [int] NULL,
	[price] [float] NOT NULL,
	[quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Orders]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](50) NULL,
	[create_date] [datetime] NOT NULL,
	[address] [nvarchar](100) NOT NULL,
	[nguoinhan] [nvarchar](50) NOT NULL,
	[tongtien] [float] NOT NULL,
	[available] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Products]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Products](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[category_id] [char](4) NULL,
	[name] [nvarchar](50) NOT NULL,
	[image] [nvarchar](50) NOT NULL,
	[price] [float] NOT NULL,
	[quantity] [int] NULL,
	[available] [bit] NOT NULL,
	[sale_id] [int] NULL,
 CONSTRAINT [PK__Products__3213E83FE24BFA19] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Roles](
	[id] [varchar](10) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Sizes]    Script Date: 9/19/2023 9:39:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sizes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NULL,
	[size] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[Accounts] ([username], [password], [fullname], [email], [photo]) VALUES (N'NV01', N'123', N'Phạm Trung Hiếu', N'hieupt@fpt.edu.vn', N'hieu.jpg')
INSERT [dbo].[Accounts] ([username], [password], [fullname], [email], [photo]) VALUES (N'NV02', N'123', N'Huỳnh Đức Hoàn', N'hoanhd@fpt.edu.vn', N'hoan.jpg')
INSERT [dbo].[Accounts] ([username], [password], [fullname], [email], [photo]) VALUES (N'NV03', N'123', N'Bùi Xuân Việt', N'vietbx@fpt.edu.vn', N'viet.jpg')
INSERT [dbo].[Accounts] ([username], [password], [fullname], [email], [photo]) VALUES (N'NV04', N'123', N'Phạm Đăng Nguyên', N'nguyenpd@fpt.edu.vn', N'nguyen.jpg')
SET IDENTITY_INSERT [dbo].[Authorities] ON 

INSERT [dbo].[Authorities] ([id], [username], [roleId]) VALUES (1, N'NV01', N'DIRE')
INSERT [dbo].[Authorities] ([id], [username], [roleId]) VALUES (2, N'NV02', N'STAF')
INSERT [dbo].[Authorities] ([id], [username], [roleId]) VALUES (3, N'NV03', N'CUST')
SET IDENTITY_INSERT [dbo].[Authorities] OFF
INSERT [dbo].[Categories] ([id], [name]) VALUES (N'AD  ', N'Adidas')
INSERT [dbo].[Categories] ([id], [name]) VALUES (N'M   ', N'MLB')
INSERT [dbo].[Categories] ([id], [name]) VALUES (N'NK  ', N'Nike')
SET IDENTITY_INSERT [dbo].[discount_codes] ON 

INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (1, N'BXV', CAST(10.10 AS Decimal(10, 2)), CAST(N'2023-09-29' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (2, N'HDH1', CAST(10.20 AS Decimal(10, 2)), CAST(N'2023-09-29' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (3, N'PDN', CAST(0.50 AS Decimal(10, 2)), CAST(N'2023-09-17' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (4, N'PDN', CAST(0.50 AS Decimal(10, 2)), CAST(N'2023-09-17' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (14, N'hahkivnha', CAST(0.10 AS Decimal(10, 2)), CAST(N'2023-09-30' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (15, N'XuanViet', CAST(0.10 AS Decimal(10, 2)), CAST(N'2023-09-07' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (16, N'VBX', CAST(1.00 AS Decimal(10, 2)), CAST(N'2023-09-09' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (17, N'PTMH', CAST(30.00 AS Decimal(10, 2)), CAST(N'2023-09-09' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (18, N'BTD', CAST(100.00 AS Decimal(10, 2)), CAST(N'2023-09-16' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (20, N'HTML', CAST(9.10 AS Decimal(10, 2)), CAST(N'2023-09-30' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (21, N'PDN', CAST(10.50 AS Decimal(10, 2)), CAST(N'2023-09-17' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (23, N'hahkivnha', CAST(20.10 AS Decimal(10, 2)), CAST(N'2023-09-24' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (28, N'123', CAST(30.00 AS Decimal(10, 2)), CAST(N'2023-09-30' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (29, N'TrungThu2023', CAST(30.00 AS Decimal(10, 2)), CAST(N'2023-09-15' AS Date))
INSERT [dbo].[discount_codes] ([id], [code], [discount_amount], [expiration_date]) VALUES (30, N'DTV', CAST(30.00 AS Decimal(10, 2)), CAST(N'2023-09-23' AS Date))
SET IDENTITY_INSERT [dbo].[discount_codes] OFF
SET IDENTITY_INSERT [dbo].[discount_Sales] ON 

INSERT [dbo].[discount_Sales] ([id], [name], [start_date], [end_date], [percentage], [activate]) VALUES (1, N'KHM01', CAST(N'2023-01-09' AS Date), CAST(N'2023-05-09' AS Date), 30, 0)
INSERT [dbo].[discount_Sales] ([id], [name], [start_date], [end_date], [percentage], [activate]) VALUES (6, N'KH02', CAST(N'2023-09-23' AS Date), CAST(N'2023-09-30' AS Date), 10, 0)
INSERT [dbo].[discount_Sales] ([id], [name], [start_date], [end_date], [percentage], [activate]) VALUES (1002, N'KHM03', CAST(N'2023-09-17' AS Date), CAST(N'2023-09-30' AS Date), 30, 0)
SET IDENTITY_INSERT [dbo].[discount_Sales] OFF
SET IDENTITY_INSERT [dbo].[OrderDetails] ON 

INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (2, 2, 24, 50, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (4, 4, 16, 35, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (5, 5, 24, 50, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (7, 7, 24, 50, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (8, 8, 9, 100, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (10, 9, 1, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (11, 9, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (12, 9, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (13, 10, 9, 100, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (14, 10, 9, 100, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (15, 10, 10, 80, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (16, 10, 10, 80, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (18, 11, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (19, 12, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (20, 13, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (21, 14, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (22, 15, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (23, 16, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (24, 17, 1, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (25, 17, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (26, 17, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (27, 18, 9, 100, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (28, 18, 9, 100, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (29, 19, 8, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (30, 19, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (31, 19, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (32, 20, 1, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (33, 21, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (34, 22, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (35, 23, 2, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (36, 24, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (37, 25, 9, 100, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (38, 25, 9, 100, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (39, 26, 1, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (40, 27, 1, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (41, 27, 1, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (42, 28, 8, 90, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (43, 28, 10, 80, 1)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (44, 29, 8, 90, 2)
INSERT [dbo].[OrderDetails] ([id], [order_id], [product_id], [price], [quantity]) VALUES (45, 29, 8, 90, 1)
SET IDENTITY_INSERT [dbo].[OrderDetails] OFF
SET IDENTITY_INSERT [dbo].[Orders] ON 

INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (2, N'NV01', CAST(N'2023-02-01 00:00:00.000' AS DateTime), N'68 Phú Nhuận', N'Hiếu', 50, 1)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (4, N'NV01', CAST(N'2023-04-01 00:00:00.000' AS DateTime), N'68 Phú Nhuận', N'Hiếu', 35, 1)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (5, N'NV01', CAST(N'2023-05-01 00:00:00.000' AS DateTime), N'68 Phú Nhuận', N'Hiếu', 50, 1)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (7, N'NV01', CAST(N'2021-12-01 00:00:00.000' AS DateTime), N'68 Phú Nhuận', N'Hiếu', 50, 1)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (8, N'nv01', CAST(N'2023-08-09 15:47:29.523' AS DateTime), N'HCm', N'Nguyen Dang', 260, 1)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (9, N'nv01', CAST(N'2023-08-09 15:58:48.833' AS DateTime), N'HCm', N'Nguyen Dang', 360, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (10, N'nv01', CAST(N'2023-08-09 22:43:41.627' AS DateTime), N'HCm', N'Nguyen Dang', 440, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (11, N'nv01', CAST(N'2023-08-09 22:46:21.603' AS DateTime), N'HCm', N'Nguyen Dang', 180, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (12, N'nv01', CAST(N'2023-08-09 22:46:51.013' AS DateTime), N'HCm', N'Nguyen Dang', 90, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (13, N'nv01', CAST(N'2023-08-09 22:49:43.683' AS DateTime), N'HCm', N'Nguyen Dang', 90, 1)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (14, N'nv01', CAST(N'2023-08-09 22:55:40.667' AS DateTime), N'HCm', N'Nguyen Dang', 90, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (15, N'nv01', CAST(N'2023-08-09 22:58:18.820' AS DateTime), N'HCm', N'Nguyen Dang', 90, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (16, N'nv01', CAST(N'2023-08-09 22:58:38.257' AS DateTime), N'HCm', N'Nguyen Dang', 90, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (17, NULL, CAST(N'2023-08-10 19:00:56.697' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa, Quận Bình Tân, Thành Phố Hồ Chí Minh', N'Hoàng Đình Được', 360, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (18, N'NV01', CAST(N'2023-08-10 19:03:30.010' AS DateTime), N'305 Lý Thái Tộ Thôn Hiệp Tiến, xã Tân Tiến', N'Bùi Xuân Việt', 300, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (19, N'NV01', CAST(N'2023-09-07 15:28:13.090' AS DateTime), N'Quận BÌnh Tân, Thành Phố Hồ Chí Minh', N'Bùi Xuân Việt', 360, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (20, N'NV01', CAST(N'2023-09-07 15:49:40.587' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa, Quận Bình Tân, Thành Phố Hồ Chí Minh', N'Hoàng Đình Được', 180, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (21, N'NV01', CAST(N'2023-09-07 16:23:21.150' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa, Quận Bình Tân, Thành Phố Hồ Chí Minh', N'Hoàng Đình Được', 90, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (22, N'NV01', CAST(N'2023-09-12 08:03:44.553' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 90, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (23, N'NV01', CAST(N'2023-09-12 08:04:11.500' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 179.82, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (24, N'NV01', CAST(N'2023-09-12 09:43:39.000' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 63, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (25, N'NV01', CAST(N'2023-09-13 13:18:28.010' AS DateTime), N'Quận BÌnh Tân, Thành Phố Hồ Chí Minh', N'Bùi Xuân Việt', 269.7, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (26, N'NV01', CAST(N'2023-09-13 14:37:38.710' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 80.91, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (27, N'nv01', CAST(N'2023-09-13 15:37:55.510' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 323.64, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (28, NULL, CAST(N'2023-09-13 15:49:06.637' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 170, NULL)
INSERT [dbo].[Orders] ([id], [username], [create_date], [address], [nguoinhan], [tongtien], [available]) VALUES (29, N'NV03', CAST(N'2023-09-14 16:28:59.500' AS DateTime), N'205/20 Phạm Đăng Giảng, Phường Bình Hưng Hòa', N'Bùi Xuân Việt', 242.73, NULL)
SET IDENTITY_INSERT [dbo].[Orders] OFF
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (1, N'M   ', N'MLB Chunky Liner Mid Denim Boston Red', N'm1.webp', 90, 10, 1, 1)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (2, N'M   ', N'MLB BigBall Chunky A Gradient Classic', N'm2.webp', 90, 10, 1, 1)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (3, N'M   ', N'MLB Bigball Chunky A New York Yankees', N'm3.webp', 90, 10, 0, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (4, N'M   ', N'MLB BigBall Chunky A LA Dodgers Off-White', N'm4.webp', 60, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (5, N'M   ', N'MLB BigBall Chunky Cube Monogram New', N'm7.webp', 50, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (6, N'M   ', N'MLB Chunky-Liner High Boston Red Sox Wine', N'm8.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (7, N'M   ', N'MLB Mule Playball Origin New York Yankees', N'm9.webp', 60, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (8, N'AD  ', N'Adidas Stan Smith', N'a1.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (9, N'AD  ', N'Adidas Superstar', N'a2.webp', 100, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (10, N'AD  ', N'Adidas Ultraboost', N'a3.webp', 80, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (11, N'AD  ', N'Adidas NMD', N'a4.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (12, N'AD  ', N'Adidas Gazelle', N'a5.webp', 100, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (13, N'AD  ', N'Adidas Yeezy', N'a6.webp', 80, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (14, N'AD  ', N'Adidas Continental 80', N'a7.webp', 30, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (15, N'AD  ', N'Adidas Campus', N'a8.webp', 55, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (16, N'NK  ', N'Nike Air Force 1', N'n1.webp', 35, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (17, N'NK  ', N'Nike Air Max 90', N'n2.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (18, N'NK  ', N'Nike Air Jordan 1', N'n3.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (19, N'NK  ', N'Nike React Element 55', N'n4.webp', 60, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (20, N'NK  ', N'Nike Dunk Low', N'n5.webp', 40, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (21, N'NK  ', N'Nike Cortez', N'n6.webp', 80, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (22, N'NK  ', N'Nike Air Max 270', N'n7.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (23, N'NK  ', N'Nike Zoom Pegasus 37', N'n8.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (24, N'NK  ', N'Nike Blazer Mid', N'n9.webp', 50, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (25, N'NK  ', N'Nike SB Dunk High', N'n10.webp', 90, 10, 1, NULL)
INSERT [dbo].[Products] ([id], [category_id], [name], [image], [price], [quantity], [available], [sale_id]) VALUES (26, N'NK  ', N'Giày Nike Air Force 1 Mid ‘White Black’ DV0806-101', N'3f2ec16a.webp', 3900, NULL, 1, 1)
SET IDENTITY_INSERT [dbo].[Products] OFF
INSERT [dbo].[Roles] ([id], [name]) VALUES (N'CUST', N'Customers')
INSERT [dbo].[Roles] ([id], [name]) VALUES (N'DIRE', N'Directors')
INSERT [dbo].[Roles] ([id], [name]) VALUES (N'STAF', N'Staffs')
SET IDENTITY_INSERT [dbo].[Sizes] ON 

INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (1, 1, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (2, 1, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (3, 1, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (4, 1, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (5, 1, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (6, 1, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (7, 1, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (8, 2, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (9, 2, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (10, 2, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (11, 2, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (12, 2, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (13, 2, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (14, 2, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (15, 3, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (16, 3, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (17, 3, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (18, 3, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (19, 3, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (20, 3, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (21, 3, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (22, 4, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (23, 4, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (24, 4, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (25, 4, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (26, 4, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (27, 4, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (28, 4, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (29, 5, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (30, 5, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (31, 5, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (32, 5, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (33, 5, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (34, 5, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (35, 5, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (36, 6, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (37, 6, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (38, 6, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (39, 6, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (40, 6, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (41, 6, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (42, 6, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (43, 7, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (44, 7, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (45, 7, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (46, 7, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (47, 7, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (48, 7, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (49, 7, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (50, 8, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (51, 8, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (52, 8, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (53, 8, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (54, 8, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (55, 8, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (56, 8, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (57, 9, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (58, 9, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (59, 9, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (60, 9, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (61, 9, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (62, 9, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (63, 9, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (64, 10, 38)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (65, 10, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (66, 10, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (67, 10, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (68, 10, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (69, 10, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (70, 10, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (71, 11, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (72, 11, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (73, 12, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (74, 12, 42)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (75, 13, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (76, 13, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (77, 14, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (78, 14, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (79, 15, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (80, 15, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (81, 16, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (82, 16, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (83, 17, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (84, 17, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (85, 18, 40)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (86, 18, 41)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (87, 19, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (88, 20, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (89, 21, 44)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (90, 22, 39)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (91, 23, 43)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (92, 24, 45)
INSERT [dbo].[Sizes] ([id], [product_id], [size]) VALUES (93, 25, 39)
SET IDENTITY_INSERT [dbo].[Sizes] OFF
ALTER TABLE [dbo].[Authorities]  WITH CHECK ADD FOREIGN KEY([roleId])
REFERENCES [dbo].[Roles] ([id])
GO
ALTER TABLE [dbo].[Authorities]  WITH CHECK ADD FOREIGN KEY([username])
REFERENCES [dbo].[Accounts] ([username])
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([order_id])
REFERENCES [dbo].[Orders] ([id])
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK__OrderDeta__produ__286302EC] FOREIGN KEY([product_id])
REFERENCES [dbo].[Products] ([id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK__OrderDeta__produ__286302EC]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([username])
REFERENCES [dbo].[Accounts] ([username])
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK__Products__catego__239E4DCF] FOREIGN KEY([category_id])
REFERENCES [dbo].[Categories] ([id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK__Products__catego__239E4DCF]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD FOREIGN KEY([sale_id])
REFERENCES [dbo].[discount_Sales] ([id])
GO
ALTER TABLE [dbo].[Sizes]  WITH CHECK ADD FOREIGN KEY([product_id])
REFERENCES [dbo].[Products] ([id])
GO
USE [master]
GO
ALTER DATABASE [ShoeGalaxy] SET  READ_WRITE 
GO
