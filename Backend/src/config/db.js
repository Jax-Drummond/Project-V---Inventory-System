import { Sequelize } from "sequelize"

class DB 
{
    constructor()
    {
        this.sequelize = new Sequelize(
            "db name goes here",
            "db username goes here",
            "db password goes here",
            {
                host: "localhost",
                dialect: "mysql",
                logging: false,
            }
        )
    }

    async connect()
    {
        try
        {
            await this.sequelize.authenticate()
            console.log("Connected to database.")
        }
        catch (e)
        {
            console.error("Failed to connect to database: ", e.message)
        }
    }

    getInstance()
    {
        return this.sequelize
    }
}

export default new DB();