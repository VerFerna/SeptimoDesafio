import { Server } from "socket.io";
import ProductManager from "../dao/mongoDB/productManager.js";
import CartManager from "../dao/mongoDB/cartManager.js";
import ChatManager from "../dao/mongoDB/chatManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();
const chatManager = new ChatManager();

export default function socketioHandler(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`New user ${socket.id} joined`);

    //Recibe del front - Creacion de producto
    socket.on("client:newProduct", async (data) => {
      try {
        const { title, description, price, code, stock, category } = data;

        const thumbnail = Array.isArray(data.thumbnail)
          ? data.thumbnail
          : data.thumbnail.length > 0
          ? [data.thumbnail]
          : [];

        const postProducts = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          category,
        };

        await productManager.addProduct(postProducts);

        //Envia el back
        const products = await productManager.getProducts();
        const listProducts = products.filter(
          (product) => product.status === true
        );

        io.emit("server:list", listProducts);
      } catch (err) {
        io.emit("server:error", err.message);
      }
    });

    //Recibe del front - Eliminacion de producto
    socket.on("client:deleteProduct", async (data) => {
      try {
        const id = data;

        const logicalDeleteProduct = await productManager.logicalDeleteProduct(
          id
        );

        //Envia el back
        const products = await productManager.getProducts();
        const listProducts = products.filter(
          (product) => product.status === true
        ); //Solo para mostrar los productos con status true
        io.emit("server:list", listProducts);
      } catch (error) {
        io.emit("server:error", error.message);
      }
    });

    //Recibe del front - Eliminacion de producto (en carrito)
    socket.on("client:deleteProductOnCart", async (data) => {
      try {
        const { cid, pid } = data; // Recibir cid y pid desde el cliente
        const deleteProductOnCart = await cartManager.deleteProductById(
          cid,
          pid
        );

        //Envia el back
        const cart = await cartManager.getCartById(cid);
        io.emit("server:cart", cart);
      } catch (err) {
        io.emit("server:error", err.message);
      }
    });

    //Recibe del front - Incorporacion de producto (en carrito)
    socket.on("client:addProductOnCart", async (data) => {
      try {
        const { cid, id: pid, selectedQuantity } = data; // Recibir cid, pid y selectedQuantity desde el cliente
        const quantity = selectedQuantity > 1 ? selectedQuantity : 1;

        const addProductOnCart = await cartManager.updateCart(
          cid,
          pid,
          quantity
        );

        //Envia el back
        const cart = await cartManager.getCartById(cid);
        io.emit("server:add", cart);
      } catch (error) {
        io.emit("server:error", error.message);
      }
    });

    socket.on("new", (user) => console.log(`${user} joined`));

    //Recibe del front - Mensajes
    socket.on("client:message", async (data) => {
      const message = await chatManager.saveMessage(data);
      //Envia el back
      const messages = await chatManager.getMessages();
      const messagesReverse = messages.reverse();
      io.emit("server:messages", messagesReverse);
    });

    //Recibe del front - Mensajes
    socket.on("client:editMessage", async (data) => {
      const { id, user, message, hour } = data;

      const newMessage = await chatManager.editMessage(id, {
        user,
        message,
        hour,
      });
      //Envia el back
      const messages = await chatManager.getMessages();
      const messagesReverse = messages.reverse();
      io.emit("server:messages", messagesReverse);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
}
