# [Build a Neo4J & GraphQL API](https://egghead.io/courses/build-a-neo4j-graphql-api)

* [Model Simple Data in a Graph For Use in Neo4J](https://egghead.io/lessons/egghead-model-simple-data-in-a-graph-for-use-in-neo4j)

    We will take a look at how we can take the relational data provided by the Star Wars API (https://swapi.co/api), and model it in a graph context for use in Neo4J.

    The API's data describes to us the entities (People, Films, Planets, etc) that exist in the Star Wars universe. Each entity endpoint in the API returns a list of entities of that type, their properties, and links to other entities that they share some relationship with. In a graph model, however, these relationships would be explicit connections between entities.

    We'll use ARROW TOOL (https://apcjones.com/arrows) to build a visual representation of our model.

* [Create Nodes and Relationships in Neo4J with Cypher](https://egghead.io/lessons/neo4j-create-nodes-and-relationships-in-neo4j-with-cypher)

    There are different types of data in Neo4J: Nodes and Relationships. We will cover the ways to create each type of data: creating nodes with properties, creating nodes with relationships, and creating constraints on nodes and relationships.

* [Read Nodes and Relationships in Neo4J with Cypher](https://egghead.io/lessons/egghead-read-nodes-and-relationships-in-neo4j-with-cypher)

    Once there is data in Neo4J, we need to be able to access it. We will cover the structure of a cypher query to return parts of our graph.

* [Update Nodes and Relationships in Neo4J with Cypher](https://egghead.io/lessons/egghead-update-nodes-and-relationships-in-neo4j-with-cypher)

    The data in our graph is unlikely to stay the same forever. We will cover the syntax used to find and modify existing data in different ways through the use of parameters.

* [Delete Nodes and Relationships in Neo4J with Cypher](https://egghead.io/lessons/egghead-delete-nodes-and-relationships-in-neo4j-with-cypher)

    Nothing lives forever, so we need to know how to use DELETE and DETACH to get rid of nodes and relationships we no longer want in our graph.

* [Use `neo4j-graphql-js` To Create A Simple API](https://egghead.io/lessons/egghead-use-neo4j-graphql-js-to-create-a-simple-api) ([code](https://github.com/amsross/neo4j-graphql/tree/use-neo4j-graphql-js-to-create-a-simple-api))

    We will learn about `neo4j-graphql-js` and how to leverage it to quickly create a full-featured API backed by Neo4J. We will create a few simple schemas to represent our model.

* [Convert Relational Data to Graph Data for Neo4J](https://egghead.io/lessons/egghead-convert-relational-data-to-graph-data-for-neo4j) ([code](https://github.com/amsross/neo4j-graphql/tree/convert-relational-data-to-graph-data-for-neo4j))

    We will write a simple API scraper to fetch relational data from SWAPI and update it to conform to a graph model for use in Neo4J
