const { Label } = require('../models');
const labelController = {

    /**
     * Transmet la label des labels au format JSON
     *  en réponse à une requete HTTP.
     *  
     * @param {Request} request 
     * @param {Response} response 
     */
    getAll: async (request, response) => {
        
        try {
             // récupérer toutes les labels
            const labels = await Label.findAll();

            // Les renvoyer au format JSON
            response.json(labels);

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }

    },

    /**
     * Transmet UNE label en réponse à une requete HTTP.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    getOneById: async (request, response) => {

        try {
            // récupérer la label demandée
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // la transmettre
                response.json(label);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    },

    create: async (request, response) => {
        // Récupérer les infos de la label à créer
        const name = request.body.name;
        // console.log(request.body);
        const errors = [];

        if (name.length === 0) {
            errors.push('Le nom de la label est obligatoire');
        }

        // exemple si on avait un champs couleur à notre label
        // if (color.length != 6) {
        //     errors.push(`La couleur n'est pas au format hexadécimal`);
        // }

        if (errors.length === 0) {
            // Si je suis ici, c'est qu'il n'y a pas d'erreur dans mes données.
            // Créer une nouvelle label
            try {

                // const label = Label.build({
                //     name
                // });

                // // l'enregistrer en base de données
                // await label.save();

                // equivalent aux 2 étapes précédentes.
                const label = await Label.create({
                    name
                });

                // On renvoie à notre client la label qui a été enregistrée en BDD
                response.json(label);

            } catch (error) {
                console.log(error)
                response.status(500).send('Une erreur est surevnue');
            }


            // Répondre au client avec les infos de la label enregistrée.
        }
        else {
            // Lui répondre avec les erreurs rencontré et le code HTTP approprié
            response.status(422).json(errors);
        }

      
    },

    /**
     * Modification partielle d'une label.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    update: async (request, response) => {

        // récuperer la label à modifier
        try {
            // récupérer la label demandée
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // J'ai bien récupéré la label à modifier.

                // modifier la label avec les données reçues
                if (request.body.name !== undefined) {
                    // Si dans le corps de la requete, j'ai une propriété name
                    // alors je modifie ma label avec la données reçue.
                    label.name = request.body.name;
                }

                // Enregistrer la label modifiée
                await label.save();

                // Répondre au client.
                // la transmettre
                response.json(label);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }

    },


    /**
     * Modification complete d'une label.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    updatePut: async (request, response) => {

        // récuperer la label à modifier
        try {
            // récupérer la label demandée
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // J'ai bien récupéré la label à modifier.
                const errors = [];
                // modifier la label avec les données reçues
                if (request.body.name == undefined) {
                    errors.push('le nom doit être fourni');
                }

                if (errors.length === 0) {

                    // On met à jour la label dans la base de données
                    label.name = request.body.name;
                    
                    // Enregistrer la label modifiée
                    await label.save();

                    // Répondre au client.
                    // la transmettre
                    response.json(label);
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
         // récuperer la label à modifier
         try {
            // récupérer la label demandée
            const label = await Label.findByPk(request.params.id);

            if (label === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // supprimer la label demandée
                await label.destroy();

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

module.exports = labelController;