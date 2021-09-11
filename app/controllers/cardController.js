const { List, Card, Label } = require('../models');

const cardController = {

    /**
     * Renvoie toutes les cartes de la carte spécifiée dans la route
     * 
     * Route : /lists/:id/cards
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    getAllForList: async (request, response) => {
        try {
            // récupérer la carte et toutes les cartes associées
            const list = await List.findByPk(request.params.id, {
                include: 'cards'
            });

            if (list === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            }
            else {
                response.json(list.cards);
            }


        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    },
    
    /**
     * Transmet UNE carte en réponse à une requete HTTP.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    getOneById: async (request, response) => {

        try {
            // récupérer la carte demandée
            const card = await Card.findByPk(request.params.id, {
                include: 'labels'
            });

            if (card === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // la transmettre
                response.json(card);
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est survnue');
        }
    },


    create: async (request, response) => {
        // Récupérer les infos de la carte à créer
        const title = request.body.title;
        const color = request.body.color;
        const position = parseInt(request.body.position, 10);
        const list_id = parseInt(request.body.list_id, 10);
        console.log(position);
        // console.log(request.body);
        const errors = {};

        if (title.length === 0) {
            errors.title = 'Le nom de la carte est obligatoire';
        }

        if (color && color[0] !== '#') {
            errors.color = 'La couleur doit être au format héxadécimal.';
        }

        if (isNaN(position) || position < 0) {
            errors.position = 'La position doit être un chiffre supérieur à 0';
        }
        else {
            // vérifier si la position n'est pas déjà prise

            const cardsWithDesiredPosition = await Card.findAll({
                where: {
                    'list_id': list_id,
                    'position' : position
                }
            });

            if (cardsWithDesiredPosition.length != 0) {
                errors.position = 'La position est déjà utilisée';
            }
            
        }

        // exemple si on avait un champs couleur à notre carte
        // if (color.length != 6) {
        //     errors.push(`La couleur n'est pas au format hexadécimal`);
        // }

        if (Object.keys(errors).length === 0) {
            // Si je suis ici, c'est qu'il n'y a pas d'erreur dans mes données.
            // Créer une nouvelle carte
            try {

                const card = await Card.create({
                    title,
                    list_id,
                    color,
                    position
                });

                // On renvoie à notre client la carte qui a été enregistrée en BDD
                response.json(card);

            } catch (error) {
                console.log(error)
                response.status(500).send('Une erreur est surevnue');
            }


            // Répondre au client avec les infos de la carte enregistrée.
        }
        else {
            // Lui répondre avec les erreurs rencontré et le code HTTP approprié
            response.status(422).json(errors);
        }

      
    },

    update: async(request, response) => {
         // récuperer la carte à modifier
         try {
            // récupérer la carte demandée
            const card = await Card.findByPk(request.params.id);

            if (card === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // J'ai bien récupéré la carte à modifier.

                errors = [];

                if (request.method === 'PATCH') {
                    // modifier la carte avec les données reçues
                    if (request.body.title !== undefined) {
                        card.title = request.body.title;
                    }
                    if (request.body.list_id !== undefined) {
                        card.list_id = request.body.list_id;
                    }
                    if (request.body.color !== undefined) {
                        card.color = request.body.color;
                    }
                    if (request.body.position !== undefined) {
                        card.position = request.body.position;
                    }
                }
                else {
                    // dans le cas du PUT, on s'assure d'avoir reçu toutes
                    // les données
                    // TODO : faire la même validation de données que pour le POST

                    if (request.body.title === undefined) {
                        errors.push('Le titre de la carte est obligatoire');
                    }
                    if (request.body.list_id === undefined) {
                        errors.push('Le carte_id de la carte est obligatoire');
                    }
                    if (request.body.color === undefined) {
                        errors.push('Le couleur de la carte est obligatoire');
                    }
                    if (request.body.position === undefined) {
                        errors.push('Le position de la carte est obligatoire');
                    }

                    card.color = request.body.color;
                    card.list_id = request.body.list_id;
                    card.title = request.body.title;
                    card.position = request.body.position;

                }
               
                if (errors.length === 0) {

                    // Enregistrer la carte modifiée
                    await card.save();

                    // Répondre au client.
                    // la transmettre
                    response.json(card);
                }
                else {
                    response.status(422).json(errors);
                }

            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    },

    delete: async (request, response) => {
         // récuperer la carte à modifier
         try {
            // récupérer la carte demandée
            const card = await Card.findByPk(request.params.id);

            if (card === null) {
                response.status(404).send(`La ressource demandée n'existe pas`);
            } else {

                // supprimer la carte demandée
                await card.destroy();

                // Répondre au client.
                // la transmettre
                response.send("La suppression s'est bien passée");
            }

        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
        
    },

    /**
     * Associe une carte avec un label.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    associateLabel: async (request, response) => {
        try {
            const card = await Card.findByPk(request.params.cardId);
            const label = await Label.findByPk(request.params.labelId);

            if (!card) {
                response.status(404).json(['La carte est non disonible']);
            } else if (!label) {
                response.status(404).json(['Le label est non disonible']);
            } else {

                // ici la fonction addLabel existe parce qu'on a créé une association
                // entre Label et Card. Sequelize à donc rajouté une fonction
                // addLabel à notre objet instancié depuis la classe Card 
                const result = await card.addLabel(request.params.labelId);

                console.log(result);
                response.json(result);
            }
        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
    },

    /**
     * Associe une carte avec un label.
     * 
     * @param { Request } request 
     * @param { Response } response 
     */
    dissociateLabel: async (request, response) => {
        try {
            const card = await Card.findByPk(request.params.cardId);
            const label = await Label.findByPk(request.params.labelId);

            if (!card) {
                response.status(404).json(['La carte est non disonible']);
            } else if (!label) {
                response.status(404).json(['Le label est non disonible']);
            } else {
                const result = await card.removeLabel(label);
                console.log(result);
                response.json(result);
            }
        } catch (error) {
            console.log(error);
            response.status(500).send('Une erreur est surevnue');
        }
        
    }

}

module.exports = cardController;