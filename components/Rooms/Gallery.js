import React, { useEffect, useState } from 'react';
import { Card, Row, Column, Image, Text } from '../../core';

export default function Gallery({ data, ...props }) {
  return (
    <Card noShadow padding={[10]} margin={[5, 0]} {...props}>
      <Row>
        {data.imageUrls.map((val, index) => (
          <Column
            md={
              data.imageUrls.length == 1
                ? 8
                : data.imageUrls.length == 2 && index2 == 0
                ? 4
                : data.imageUrls.length == 2 && index2 == 2
                ? 8
                : 4
            }
            padding={[5]}
            key={'gallery' + index}>
            <Image src={data.baseUrl.lg + val} style={{ width: '100%', borderRadius: 8, height: 330 }} />
          </Column>
        ))}
      </Row>
    </Card>
  );
}
