const express = require("express");
const Message = require("../entities/messages.js");

function initMessage(db) {
  const router = express.Router();

  // Utiliser JSON pour les requêtes
  router.use(express.json());

  // Middleware pour logger les requêtes
  router.use((req, res, next) => {
    console.log("API: method %s, path %s", req.method, req.path);
    console.log("Body", req.body);
    next();
  });

  const message = new Message(); // Créer une instance de la classe Message

  // Créer un nouveau message

  router.post("/messages/", async (req, res) => {
    const { login, content } = req.body;

    try {
      const id = await message.createMsg(login, content);
      res.status(201).json({ id }); // renvoie une réponse HTTP 201 Created avec l'ID du nouveau message créé
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating message"); // renvoie une réponse HTTP 500 Internal Server Error en cas d'erreur
    }
  });

  // Récupérer un message spécifique
  router.get("/messages/:id", async (req, res) => {
    const id = req.params.id;

    message
      .getMsg(id)
      .then((msg) => {
        if (!msg) {
          res.status(404).send("Message not found"); // renvoie une réponse HTTP 404 Not Found si le message n'existe pas
        } else {
          res.json(msg); // renvoie le message au format JSON
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error getting message"); // renvoie une réponse HTTP 500 Internal Server Error en cas d'erreur
      });
  });

  // Modifier un message existant
  router.put("/messages/:id", async (req, res) => {
    const id = req.params.id;
    const { content } = req.body;

    message
      .updateMsg(id, content)
      .then(() => {
        res.status(204).end(); // renvoie une réponse HTTP 204 No Content si le message a été modifié avec succès
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error updating message"); // renvoie une réponse HTTP 500 Internal Server Error en cas d'erreur
      });
  });

  // Supprimer un message existant
  router.delete("/messages/:id", async (req, res) => {
    const msgId = req.params.id;
    try {
      await message.deleteMsg(msgId);
      res.status(204).end(); // renvoie une réponse HTTP 204 No Content
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting message"); // renvoie une réponse HTTP 500 Internal Server Error
    }
  });

  // Liker un message
  router.post("/messages/:id/like", async (req, res) => {
    const id = req.params.id;
    const { user } = req.body;

    message
      .likeMsg(id, user)
      .then((success) => {
        if (success) {
          res.status(204).end(); // renvoie une réponse HTTP 204 No Content si le like a été ajouté avec succès
        } else {
          res.status(404).send("Message not found"); // renvoie une réponse HTTP 404 Not Found si le message n'existe pas
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error liking message"); // renvoie une réponse HTTP 500 Internal Server Error en cas d'erreur
      });
  });

  // Unliker un message
  router.post("/messages/:id/unlike", async (req, res) => {
    const id = req.params.id;
    const { user } = req.body;

    message
      .unlikeMsg(id, user)
      .then((success) => {
        if (success) {
          res.status(204).end(); // renvoie une réponse HTTP 204 No Content si l'unlike a été effectué avec succès
        } else {
          res.status(404).send("Message not found"); // renvoie une réponse HTTP 404 Not Found si le message n'existe pas
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error unliking message"); // renvoie une réponse HTTP 500 Internal Server Error en cas d'erreur
      });
  });

  /*
  // Commenter un message
  router.post("/messages/:id/comment", async (req, res) => {
    const id = req.params.id;
    const { user, content } = req.body;

    message
      .addComment(id, { user, content })
      .then((success) => {
        if (success) {
          res.status(204).end(); // renvoie une réponse HTTP 204 No Content si le commentaire a été ajouté avec succès
        } else {
          res.status(404).send("Message not found"); // renvoie une réponse HTTP 404 Not Found si le message n'existe pas
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error commenting message"); // renvoie une réponse HTTP 500 Internal Server Error en cas d'erreur
      });
  });
  si je veux faire une fonctionnalité de commentaire je dois creer un composant react
*/
  return router;
}

exports.default = initMessage;
