import React, { useState, useEffect } from 'react';
import { CheckCircle } from '@material-ui/icons';
import { Row, Column, Text, Card } from '../../core';
import { toLowerCase } from '../../helper/JsHelper';

export default function Amenities({ data, ...props }) {
  const { hotel, room } = data;
  let dataAmmu = hotel.concat(room && room.length ? room : []);
  const distAmenity = Array.from(new Set(dataAmmu.map((a) => toLowerCase(a.amenityName))));

  return (
    <Card noShadow padding={[10]} margin={[5, 0]}>
      <Row>
        {distAmenity.map((value, index) => (
          <Column md={3} key={'category' + index}>
            <Row>
              <Column md={1} xs={1} center sm={1} padding={[3]}>
                <CheckCircle style={{ fontSize: 20 }} color="primary" />
              </Column>
              <Column md={11} xs={11} sm={11} padding={[3]} center>
                <Text size={16} medium transform={'capitalized'}>
                  {value}
                </Text>
              </Column>
            </Row>
          </Column>
        ))}
      </Row>
    </Card>
  );
}
