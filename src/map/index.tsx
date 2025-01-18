import {
  LatLngExpression,
  Layer,
  LeafletMouseEvent,
  Map,
  marker,
} from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import styled from "styled-components";

const center: LatLngExpression = [51.505, -0.09];
const zoom = 13;

const MapWrapper = styled(MapContainer)`
  border: 1px solid black;
  width: 100%;
  height: 100%;
`;
const ControlWrapper = styled.div`
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;

const Button = styled.button`
  border: 1px solid black;
  padding: 2px 6px;
  &:hover {
    background-color: grey;
    color: white;
  }

  &:active {
    transform: translateY(1px);
  }

  transition: all 200ms;
`;

const MapControls = ({ map }: { map: Map }) => {
  const figuresRef = useRef<Layer[]>([]);
  const addFigure = (target: { lat: number; lng: number }) => {
    const circleView = marker(target, {
      draggable: true,
    });

    circleView.bindTooltip(`Точка №${figuresRef.current.length + 1}`, {
      permanent: true,
      direction: "top",
      offset: [-14, -12],
    });

    circleView.on("click", (e) => {
      circleView.remove();
      console.log(figuresRef.current);
      figuresRef.current = figuresRef.current.filter(
        (figure) => figure !== circleView
      );
      console.log(figuresRef.current);
    });

    // Добавить круг на карту
    figuresRef.current.push(circleView);
    circleView.addTo(map);
  };

  const deleteFigures = () => {
    figuresRef.current.forEach((layer) => layer.remove());
    figuresRef.current = [];
  };

  useEffect(() => {
    const handleClick = (e: LeafletMouseEvent) => {
      console.log(e.latlng);

      addFigure(e.latlng);
    };
    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, []);

  return (
    <ControlWrapper>
      <Button onClick={deleteFigures}>remove all</Button>
    </ControlWrapper>
  );
};
