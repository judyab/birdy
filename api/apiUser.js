const express = require("express");
const User = require("../entities/users.js");

function initUser(db) {
  const router = express.Router();

  // Utiliser JSON pour les requêtes
  router.use(express.json());

  // Middleware pour logger les requêtes
  router.use((req, res, next) => {
    console.log("API: method %s, path %s", req.method, req.path);
    console.log("Body", req.body);
    next();
  });

  const users = new Users(db);

  //SIGNIN
  router.post("/users/", async (req, res) => {
    try {
      const { login, password, lastname, firstname } = req.body;
      const user = await users.create(login, password, lastname, firstname);
      res.status(201).send({ id: user.id });
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Erreur interne",
        details: e.toString()
      });
    }
  });

  //LOGIN
  router.post("/login", async (req, res) => {
    try {
      const { login, password } = req.body;

      // Vérifier que les champs login et password sont fournis
      if (!login || !password) {
        res.status(400).json({
          status: 400,
          message: "Requête invalide : login et password nécessaires"
        });
        return;
      }

      // Vérifier que l'utilisateur existe
      const userExists = await users.exists(login);
      if (!userExists) {
        res.status(401).json({
          status: 401,
          message: "Utilisateur inconnu"
        });
        return;
      }

      // Vérifier que le mot de passe est correct
      const userId = await users.checkPassword(login, password);
      if (userId) {
        // Créer une nouvelle session
        req.session.regenerate((err) => {
          if (err) {
            res.status(500).json({
              status: 500,
              message: "Erreur interne"
            });
            return;
          }

          // Enregistrer l'ID de l'utilisateur dans la session
          req.session.userId = userId;

          res.status(200).json({
            status: 200,
            message: "Login et mot de passe accepté"
          });
        });
        return;
      }

      // Si le mot de passe est incorrect, détruire la session
      req.session.destroy(() => {});

      res.status(403).json({
        status: 403,
        message: "Login et/ou le mot de passe invalide(s)"
      });
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Erreur interne",
        details: e.toString()
      });
    }
  });

  // PROFIL
  // Obtenir les informations d'un utilisateur
  router.get("/user/:user_id(\\d+)", async (req, res) => {
    try {
      const user = await users.get(req.params.user_id);

      if (!user) {
        res.sendStatus(404);
      } else {
        res.send(user);
      }
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Erreur interne",
        details: e.toString()
      });
    }
  });

  //Modifier les données d'un utilisateur
  router.put("/user/:user_id(\\d+)", async (req, res) => {
    try {
      const { bio, avatar } = req.body;
      const user = await users.get(req.params.user_id);
      if (!user) {
        res.sendStatus(404);
        return;
      }
      if (bio !== undefined) {
        user.bio = bio;
      }
      if (avatar !== undefined) {
        user.avatar = avatar;
      }
      await users.save(user);
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  // DELETE
  // Supprimer un utilisateur
  router.delete("/user/:user_id(\\d+)", async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const user = await users.get(user_id);
      if (!user) {
        res.status(404).json({
          status: 404,
          message: "Utilisateur introuvable"
        });
        return;
      }
      await users.delete(user_id);
      res.status(200).json({
        status: 200,
        message: "Utilisateur supprimé avec succès"
      });
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Erreur interne",
        details: e.toString()
      });
    }
  });

  // ALL USER
  // liste des utilisateurs
  router.get("/users", async (req, res) => {
    try {
      const allUsers = await users.list();
      res.send(allUsers);
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "erreur interne",
        details: (e || "Erreur inconnue").toString()
      });
    }
  });

  return router;
}
exports.default = initUser;
