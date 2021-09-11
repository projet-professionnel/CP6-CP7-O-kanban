const { request, response } = require('express');
const { List } = require('../models');
const listController = {

    // getAll: async (request, response) => {
    //     // récupérer toutes les listes
    //     List.findAll().then((lists) => {
    //         response.json(lists);
    //     }).catch((error) => {
    //         console.log(error);
    //         response.status(500).send('Une erreur est surevnue');
    
    //     });
    // },

    /**
     * Transmet la liste des listes au format JSON
     *  en réponse à une requete HTTP.
     *  
     * @param {Request} request 
     * @param {Response} response 
     */
    getAll: async (request, response) => {
        
        try {
             // récupérer toutes les listes
            const lists = await List.findAll();

            // Les renvoyer au format JSON
            response.json(lists);

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }

    },

    /**
     * Transmet UNE liste en réponse à une requete HTTP.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    getOneById: async (request, response) => {

        try {
            // récupérer la liste demandée
            const list = await List.findByPk(request.params.id);

            if (list === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // la transmettre
                response.json(list);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    },

    create: async (request, response) => {
        // Récupérer les infos de la liste à créer
        const name = request.body.name;
        // console.log(request.body);
        const errors = [];

        if (name.length === 0) {
            errors.push('Le nom de la liste est obligatoire');
        }

        // exemple si on avait un champs couleur à notre liste
        // if (color.length != 6) {
        //     errors.push(`La couleur n'est pas au format hexadécimal`);
        // }

        if (errors.length === 0) {
            // Si je suis ici, c'est qu'il n'y a pas d'erreur dans mes données.
            // Créer une nouvelle liste
            try {

                // const list = List.build({
                //     name
                // });

                // // l'enregistrer en base de données
                // await list.save();

                // equivalent aux 2 étapes précédentes.
                const list = await List.create({
                    name
                });

                // On renvoie à notre client la liste qui a été enregistrée en BDD
                response.json(list);

            } catch (error) {
                console.log(error)
                response.status(500).send('Une erreur est surevnue');
            }


            // Répondre au client avec les infos de la liste enregistrée.
        }
        else {
            // Lui répondre avec les erreurs rencontré et le code HTTP approprié
            response.status(422).json(errors);
        }

      
    },

    /**
     * Modification partielle d'une liste.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    update: async (request, response) => {

        // récuperer la liste à modifier
        try {
            // récupérer la liste demandée
            const list = await List.findByPk(request.params.id);

            if (list === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // J'ai bien récupéré la liste à modifier.

                // modifier la liste avec les données reçues
                if (request.body.name !== undefined) {
                    // Si dans le corps de la requete, j'ai une propriété name
                    // alors je modifie ma liste avec la données reçue.
                    list.name = request.body.name;
                }

                // Enregistrer la liste modifiée
                await list.save();

                // Répondre au client.
                // la transmettre
                response.json(list);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }

    },


    /**
     * Modification complete d'une liste.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    updatePut: async (request, response) => {

        // récuperer la liste à modifier
        try {
            // récupérer la liste demandée
            const list = await List.findByPk(request.params.id);

            if (list === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // J'ai bien récupéré la liste à modifier.
                const errors = [];
                // modifier la liste avec les données reçues
                if (request.body.name == undefined) {
                    errors.push('le nom doit être fourni');
                }

                if (errors.length === 0) {

                    // On met à jour la liste dans la base de données
                    list.name = request.body.name;
                    
                    // Enregistrer la liste modifiée
                    await list.save();

                    // Répondre au client.
                    // la transmettre
                    response.json(list);
                }
                else {
                    response.status(422).json(errors);
                }
              
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est survnue');
        }

    },

    delete: async (request, response) => {
         // récuperer la liste à modifier
         try {
            // récupérer la liste demandée
            const list = await List.findByPk(request.params.id);

            if (list === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // supprimer la liste demandée
                await list.destroy();

                // Répondre au client.
                // la transmettre
                response.send("La suppression s'est bien passée");
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
        
    }

}

module.exports = listController;