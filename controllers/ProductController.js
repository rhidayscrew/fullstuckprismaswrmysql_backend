import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const response = await prisma.product.findMany();
    res.status(200).json(response);
  } catch (error) {
    // res.status(500).json({msg: error.message});
    res.status(500).json({
      code: "500",
      status: "Internal Server Erro",
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    // Validasi nama
    if (!name) {
      return sendErrorResponse(res, 422, "Nama tidak boleh kosong");
    } else if (name.length < 3) {
      return sendErrorResponse(res, 422, "Nama produk terlalu pendek");
    }

    // Validasi harga
    if (!isValidPrice(price)) {
      return sendErrorResponse(res, 422, "Price harus berupa angka");
    }

    // Fungsi bantuan untuk mengirim respons kesalahan
    function sendErrorResponse(res, code, message) {
      return res.status(code).json({
        code: String(code),
        status: "Bad Request",
        message: message,
      });
    }

    // Fungsi bantuan untuk memvalidasi harga
    function isValidPrice(price) {
      return price !== null && price !== undefined && !isNaN(price);
    }

    const product = await prisma.product.create({
      data: {
        name: name,
        price: price,
      },
    });
    //res.status(201).json(product);
    res.status(201).json({
      code: "201",
      status: "Ok",
      messege: "Product Created Successfuly",
      Data: product,
    });
  } catch (error) {
    // res.status(400).json({ msg: error.message });
    res.status(500).json({
      code: "500",
      status: "Internal Server Error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        price: price,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
