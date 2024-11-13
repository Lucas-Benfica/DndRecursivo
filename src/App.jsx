import styled from "styled-components";
import Card from "./components/Card";
import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ActionsList from "./components/ActionsList";

const testList = [
  {
    id: "list1-0",
    name: "Lucas",
    subItems: [
      {
        id: "list1-0-0",
        name: "Lucas Filho",
        subItems: [
          { id: "list1-0-0-0", name: "Lucas Neto", subItems: [] },
          {
            id: "list1-0-0-1",
            name: "Lucas Neto II",
            subItems: [
              { id: "list1-0-0-1-0", name: "João Lucas", subItems: [] },
              { id: "list1-0-0-1-1", name: "Lucas Junior", subItems: [] },
            ],
          },
          { id: "list1-0-0-2", name: "Lucas Silva", subItems: [] },
        ],
      },
      { id: "list1-0-1", name: "Lucas irmão", subItems: [] },
      {
        id: "list1-0-2",
        name: "Lucas Sênior",
        subItems: [
          { id: "list1-0-2-0", name: "Lucas Filho Sênior", subItems: [] },
        ],
      },
    ],
  },
  {
    id: "list1-1",
    name: "Luan",
    subItems: [
      {
        id: "list1-1-0",
        name: "Luan Filho",
        subItems: [
          { id: "list1-1-0-0", name: "Luan Neto", subItems: [] },
          { id: "list1-1-0-1", name: "Luan Neto II", subItems: [] },
        ],
      },
      { id: "list1-1-1", name: "Luan Junior", subItems: [] },
      {
        id: "list1-1-2",
        name: "Luan Sênior",
        subItems: [
          {
            id: "list1-1-2-0",
            name: "Luan Bisneto",
            subItems: [
              { id: "list1-1-2-0-0", name: "Luan Tataraneto", subItems: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "list1-2",
    name: "Daniel",
    subItems: [
      {
        id: "list1-2-0",
        name: "Daniel Filho",
        subItems: [
          {
            id: "list1-2-0-0",
            name: "Daniel Neto",
            subItems: [
              { id: "list1-2-0-0-0", name: "Daniel Bisneto", subItems: [] },
            ],
          },
        ],
      },
      {
        id: "list1-2-1",
        name: "Daniel Junior",
        subItems: [
          { id: "list1-2-1-0", name: "Daniel Filho Junior", subItems: [] },
          { id: "list1-2-1-1", name: "Daniel Silva", subItems: [] },
        ],
      },
      {
        id: "list1-2-2",
        name: "Daniel Sênior",
        subItems: [
          {
            id: "list1-2-2-0",
            name: "Daniel Avô",
            subItems: [
              {
                id: "list1-2-2-0-0",
                name: "Daniel Bisavô",
                subItems: [
                  {
                    id: "list1-2-2-0-0-0",
                    name: "Daniel Neto II",
                    subItems: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "list1-3",
    name: "Carlos",
    subItems: [
      {
        id: "list1-3-0",
        name: "Carlos Filho",
        subItems: [
          { id: "list1-3-0-0", name: "Carlos Neto", subItems: [] },
          { id: "list1-3-0-1", name: "Carlos Junior", subItems: [] },
        ],
      },
      { id: "list1-3-1", name: "Carlos Silva", subItems: [] },
      {
        id: "list1-3-2",
        name: "Carlos Sênior",
        subItems: [
          {
            id: "list1-3-2-0",
            name: "Carlos Avô",
            subItems: [
              {
                id: "list1-3-2-0-0",
                name: "Carlos Bisneto",
                subItems: [
                  {
                    id: "list1-3-2-0-0-0",
                    name: "Carlos Neto III",
                    subItems: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

function App() {
  const [list, setList] = useState(testList);

  const [newName, setNewName] = useState("");

  const addNameToList = () => {
    if (newName.trim() === "") return; // Evita adicionar strings vazias

    const newItem = {
      id: `list1-${list.length}`, // Usando o length como ID
      name: newName,
      subItems: [],
    };

    // Adiciona o novo item à lista
    setList([...list, newItem]);
    setNewName(""); // Limpa o input
  };

  // Função para encontrar os subItems pelo caminho
  const findSubItemsByPath = (list, path) => {
    let currentList = list;
    let currentItem = null;

    if (path.length == 0) return list;

    // Iterar sobre cada parte do path
    for (let i = 0; i < path.length; i++) {
      const id = path[i];
      // Encontrar o item atual na lista
      currentItem = currentList.find((item) => item.id === id);

      if (!currentItem) {
        // Se não encontrar o item, retorna null
        return null;
      }

      // Avançar para a próxima lista de subItems
      currentList = currentItem.subItems || [];
    }

    // Retorna os subItems do último item encontrado
    return currentItem?.subItems || [];
  };

  const findItemById = (list, id) => {
    for (const item of list) {
      // Verifica se o item atual tem o id procurado
      if (item.id === id) return item;

      // Se tiver subItems, busca recursivamente dentro dos subItems
      if (item.subItems) {
        const found = findItemById(item.subItems, id);
        if (found) return found;
      }
    }
    return null; // Retorna null se não encontrar
  };

  function onDragEnd(result) {
    const { source, destination, combine } = result;

    if (!destination && !combine) return;

    const newList = JSON.parse(JSON.stringify(list));

    if (combine) {
      const sourcePath = source.droppableId.split("/").filter(Boolean);
      const destinationId = combine.draggableId;

      const sourceList = findSubItemsByPath(newList, sourcePath);
      const [movedItem] = sourceList.splice(source.index, 1);

      const destinationItem = findItemById(newList, destinationId);

      if (destinationItem) {
        destinationItem.subItems = destinationItem.subItems || [];
        destinationItem.subItems.push(movedItem);
      }

      setList(newList);
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourcePath = source.droppableId.split("/").filter(Boolean);
    const destinationPath = destination.droppableId.split("/").filter(Boolean);

    const sourceList = findSubItemsByPath(newList, sourcePath);
    const destList = findSubItemsByPath(newList, destinationPath);

    const [movedItem] = sourceList.splice(source.index, 1);

    // Evitar mover o pai para o próprio filho
    if (movedItem.id === destinationPath[destinationPath.length - 1]) {
      return;
    }

    destList.splice(destination.index, 0, movedItem);

    setList(newList);
  }

  return (
    <PageStyled>
      <InputContainer>
        <input
          type="text"
          placeholder="Digite um nome"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={addNameToList}>Adicionar</button>
      </InputContainer>

      <ContainerLists>
        <DragDropContext onDragEnd={onDragEnd} debugMode>
          <ActionsList
            fullList={list} // Lista completa para modificações
            setFullList={setList} // set
            list={list} // Lista que vai gerar os cards
          />
        </DragDropContext>
      </ContainerLists>
    </PageStyled>
  );
}

export default App;

const PageStyled = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .style {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;

  input {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    outline: none;
  }

  button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const ListDiv = styled.div`
  width: 250px;
  height: 500px;
  flex-shrink: 0;
  border-radius: 15px;
  padding: 15px 0;
  background-color: white;
  position: relative;

  .scroll {
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 15px 10px;
    gap: 10px;
    scrollbar-width: thin;
  }

  &.sub {
    width: 100%;
    height: 110px;
    overflow-y: auto;
    background-color: blue;
  }
`;

const ContainerLists = styled.div`
  width: 100%;
  display: flex;
  padding: 30px 50px;
  gap: 30px;
  overflow-x: auto;
  overflow-y: hidden;

  .ListDiv {
    flex-shrink: 0;
    width: 250px;
    min-width: 250px;
    height: 500px;
    border-radius: 15px;
    padding: 10px;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
