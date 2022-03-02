/* eslint-disable @next/next/no-img-element */
import { Badge, Button, Progress } from '@mantine/core';
import React from 'react';
import { useRouter } from 'next/router';

const Card = ({
  id,
  title,
  description,
  donated,
  totalDoners,
  minDonation,
  goal,
  complete,
  endAt,
  image,
  setOpened,
  setSelected,
}) => {
  const progress = (donated / goal) * 100;
  const router = useRouter();

  if (complete) {
    progress = 100;
    donated = goal;
  }

  return (
    <div className='shadow-md rounded-md p-5'>
      <div className=''>
        <img
          src={image}
          className='h-52 w-full object-cover rounded-md text-center'
          alt={title}
        />
      </div>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl my-3 font-semibold text-violet-700'>{title}</h2>
        <Badge color={complete ? 'red' : 'teal'} variant='dot'>
          {complete ? 'closed' : 'active'}
        </Badge>
      </div>
      <p className='text-gray-600 '>{description}</p>

      <div className='mt-3'>
        <Progress value={progress} />
      </div>
      <div className='flex justify-between items-center text-xs text-gray-500 mt-2 font-semibold'>
        <p>
          <span className='text-violet-500 font-bold'>{donated}</span> raised
        </p>
        <p>
          Goal <span className='text-violet-500 font-bold'>{goal}</span> Wei
        </p>
      </div>
      {/* <div className='flex justify-end mt-2 text-sm font-semibold text-gray-500'>
        Goal {goal} Wei
      </div> */}

      <div className='flex space-x-3 mt-5'>
        <Button
          disabled={complete}
          onClick={() => {
            setOpened(true);
            setSelected({ minDonation, address: id });
          }}
          variant='outline'
          className='w-full'
        >
          Donate
        </Button>
        <Button
          onClick={() => router.push(`campaign/${id}`)}
          variant='filled'
          className='w-full bg-violet-500'
        >
          View
        </Button>
      </div>
    </div>
  );
};

export default Card;
