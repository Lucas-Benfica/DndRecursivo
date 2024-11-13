import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { ListDiv } from "../App";
import Card from "./Card";
import { v4 as uuidv4 } from "uuid";

export default function ActionsList({
  fullList,
  setFullList,
  list,
  droppableId = "/",
}) {
  const [selectedAction, setSelectedAction] = useState({});

  // Atualizar o selectedAction quando a lista for atualizada
  useEffect(() => {
    // Verificar se o selectedAction ainda existe na lista atual
    if (selectedAction?.id) {
      const updatedItem = findItemById(list, selectedAction.id);
      setSelectedAction(updatedItem || {});
    }
  }, [list]);

  // Função para encontrar um item pelo id
  const findItemById = (list, id) => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.subItems) {
        const found = findItemById(item.subItems, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Função para encontrar subItens pelo path
  const findSubItemsByPath = (list, path) => {
    let currentList = list;
    let currentItem = null;
    if (path.length === 0) return list;
    for (let i = 0; i < path.length; i++) {
      const id = path[i];
      currentItem = currentList.find((item) => item.id === id);
      if (!currentItem) return null;
      currentList = currentItem.subItems || [];
    }
    return currentList;
  };

  // Função para adicionar um novo item
  const addAction = () => {
    const path = droppableId.split("/").filter(Boolean);
    const newList = JSON.parse(JSON.stringify(fullList));

    // Gera um novo item com um ID único
    const newItem = {
      id: uuidv4(),
      name: `Novo Item ${Math.floor(Math.random() * 1000)}`,
      subItems: [],
    };

    // Encontra a lista onde o novo item será adicionado
    const targetList = findSubItemsByPath(newList, path);

    if (targetList) {
      targetList.push(newItem);
      setFullList(newList); // Atualiza o estado da lista completa
    }
  };

  return (
    <>
      <Droppable
        droppableId={droppableId}
        type="list"
        direction="vertical"
        isCombineEnabled
      >
        {(provided) => (
          <ListDiv ref={provided.innerRef} {...provided.droppableProps}>
            <div className="scroll">
              {list.map((item, index) => (
                <Card
                  key={item.id}
                  info={item}
                  index={index}
                  selected={selectedAction}
                  setSelected={setSelectedAction}
                />
              ))}
              {provided.placeholder}

              <button className="styled" onClick={addAction}>
                +
              </button>
            </div>
          </ListDiv>
        )}
      </Droppable>
      {selectedAction && selectedAction.subItems && (
        <ActionsList
          fullList={fullList} // Lista completa para modificações
          setFullList={setFullList} // set
          list={selectedAction.subItems} // Lista que vai gerar os cards
          droppableId={droppableId + selectedAction.id + "/"} // Id da coluna
        />
      )}
    </>
  );
}
