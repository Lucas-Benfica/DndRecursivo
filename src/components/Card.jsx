import React from "react";
import styled from "styled-components";
import { Draggable } from "@hello-pangea/dnd";
import EditIcon from "@mui/icons-material/Edit";

export default function Card({ info, index, selected, setSelected }) {
  // Função para o clique do ícone de edição
  const handleEditClick = (event) => {
    event.stopPropagation(); // Impede que o clique no ícone dispare o clique do Card
    console.log("edit");
  };

  // Função para o clique do Card
  const handleCardClick = () => {
    console.log("clicked", info);
    if (selected.id == info.id) {
      setSelected({});
    } else {
      setSelected(info);
    }
  };

  //Estilos
  function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) {
      return style;
    }
    const { moveTo, curve, duration } = snapshot.dropAnimation;
    // move to the right spot
    const translate = `translate(${moveTo.x}px, ${moveTo.y}px)`;
    // add a bit of turn for fun
    //const rotate = "rotate(1turn)";

    // patching the existing style
    return {
      ...style,
      transform: `${translate}`,
      // slowing down the drop because we can
      transition: `all ${curve} ${duration + 1}s`,
    };
  }

  return (
    <Draggable draggableId={info.id} index={index} isCombineEnabled={true}>
      {(provided, snapshot) => (
        <CardBox
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={handleCardClick}
          className={selected.id == info.id ? "selected" : ""}
          //isDragging={snapshot.isDragging && !snapshot.isDropAnimating}
          style={getStyle(provided.draggableProps.style, snapshot)}
        >
          <ActionBox>
            {info.name}
            <EditButton onClick={handleEditClick}>
              <EditIcon />
            </EditButton>
          </ActionBox>
        </CardBox>
      )}
    </Draggable>
  );
}

const CardBox = styled.div`
  width: 100%;
  height: auto;
  min-height: 80px;
  border-radius: 5px;
  background-color: lightgray;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;

  &.selected {
    border: 2px solid green;
  }
`;

const ActionBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EditButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;

  &:hover {
    color: #ccc;
  }
`;
