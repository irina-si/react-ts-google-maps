import React, { useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import getStops from './proxy';
import stopMarkerImg from './img/marker-png.png'
import useSWR from 'swr';
import s from './app.module.css';

const fetcher = getStops;
export interface StandardComponentProps {
  children: React.ReactNode
  key: string
  lat: number
  lng: number
}

const Marker = ({children}: StandardComponentProps) => <React.Fragment>{children}</React.Fragment>;

export default function App() {
  
    const mapRef = useRef();
    const [zoom, setZoom] = useState(12);
    const [bounds, setBounds] = useState<[number,number,number,number] | undefined>(); 
  
    const url = 'http://www.minsktrans.by/city/minsk/stops.txt';
    const {data} = useSWR(url, fetcher);
   
    const stops = data ? data : [];
    const points = stops.map(stop => ({
          type: "Feature",
          properties: {
            cluster: false,
            stopId: stop.ID,
          },
          geometry: { type: "Point", coordinates: [Number(stop.Lng/100000), Number(stop.Lat/100000)] }
       }
    ))

    const { clusters, supercluster } = useSupercluster({
      points,
      bounds,
      zoom,
      options: {radius: 75, maxZoom: 20}
    })

    return (
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyC-uOfjdMh6dQ9eFdf6QbncxT37k5MhKPo' }}
            defaultCenter={{ lat: 53.893009, lng: 27.567444}}
            defaultZoom={10}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({map}) => {
              mapRef.current = map;
            }}
            onChange={({zoom, bounds}) => {
              setZoom(zoom);
              setBounds([
                bounds.nw.lng,
                bounds.se.lat,
                bounds.se.lng,
                bounds.nw.lat
              ])
            }}
           >
           {clusters.map(cluster => {
              const [longitude, latitude] = cluster.geometry.coordinates;
              const { 
                cluster: isCluster, 
                stopId: pointCount 
              } = cluster.properties;
              if (isCluster) {
                return (
                  <Marker key={cluster.properties.stopId} lat={latitude} lng={longitude}>
                    <div className={s.clusterMarker} 
                        style={
                          {width: `${10 * (pointCount / points.length) * 30}px`,
                            height: `${10 * (pointCount / points.length) * 30}px`}
                          }
                      onClick={() => {
                        const expansionZoom = Math.min(
                          supercluster?.getClusterExpansionZoom(Number(cluster.id)) || 12, 20
                        );
                        mapRef.current.setZoom(expansionZoom);
                        mapRef.current.panTo({lat: latitude, lng: longitude})
                      }}
                    >
                        {pointCount}
                    </div>
                  </Marker>
                )
              } else {
                return (
                  <Marker key={cluster.properties.stopId} lat={latitude} lng={longitude}>
                    <button className={s.stopMarker}><img src={stopMarkerImg} alt='stop-img' height='25px' width='25px'/></button>
                  </Marker>
                )
              }
           })}
          </GoogleMapReact>
        </div>
      );
}