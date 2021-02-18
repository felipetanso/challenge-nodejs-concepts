const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateIdRepository(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid repository ID"})
  }

  return next();
}

app.use('/repositories/:id', validateIdRepository);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repository = { 
    id:uuid(), 
    title, 
    url, 
    techs,
    likes:0,
  };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const {id} = request.params;
  const {title, url, techs} = request.body;
  console.log(request.body);

  const repository_index = repositories.findIndex(repository => repository.id === id);

  if(repository_index < 0){
    return response.status(400).send();
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes:repositories[repository_index].likes,
  };

  repositories[repository_index] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const {id} = request.params;

  const repository_index = repositories.findIndex(repository => repository.id === id);

  if(repository_index < 0){
    return response.status(400).send();
  }

  repositories.splice(repository_index, 1);

  return response.status(204).send();
  

});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  repository.likes += 1;

  return response.json(repository);

});

module.exports = app;
