import { Button, Input, InputWrapper, Textarea, Alert } from '@mantine/core';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import { useRouter } from 'next/router';

const Add = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [minDonation, setMinDonation] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSucess] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(Number(minDonation))) {
      setError('Invalid amount!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(title, description, image, minDonation, goal)
        .send({
          from: accounts[0],
        });
    } catch (err) {
      setLoading(false);
      setError(err.message);
      setSucess(false);
      setTimeout(() => {
        setError('');
      }, 5000);
      return;
    }

    setLoading(false);

    if (!error) {
      setSucess(true);
      setTitle('');
      setDescription('');
      setImage('');
      setMinDonation('');
      setGoal('');
    }

    setTimeout(() => {
      setSucess(false);
      router.push('/');
    }, 2000);
  };

  return (
    <>
      <h1 className='text-center text-gray-800 text-xl font-semibold mt-5'>
        Add new <span className='text-violet-600 font-bold'>Campaign</span>
      </h1>
      <div className='max-w-lg mx-auto mt-5 border-2 p-10 border-violet-100 shadow rounded'>
        {error.length > 0 && (
          <Alert
            className='mb-5'
            icon={<XCircleIcon size={16} />}
            color='red'
            title='Something went wrong!'
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            className='mb-5'
            icon={<CheckCircleIcon size={16} />}
            color='teal'
            title='Success'
          >
            Campaign is created!
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <InputWrapper label='Title' required>
            <Input
              size='md'
              placeholder='campaign title'
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper className='my-5' label='Description' required>
            <Input
              size='md'
              placeholder='campaign description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper className='my-5' label='Image URL' required>
            <Input
              size='md'
              placeholder='paste URL here'
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper
            className='my-5'
            label='Minimum Donation (Wei)'
            required
          >
            <Input
              type='number'
              size='md'
              placeholder='minimum donation'
              value={minDonation}
              onChange={(e) => setMinDonation(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper className='my-5' label='Goal (Wei)' required>
            <Input
              type='number'
              size='md'
              placeholder='Goal'
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </InputWrapper>
          <Button
            loading={loading}
            leftIcon={
              <PlusCircleIcon className='mb-[0.19rem]' width={18} height={18} />
            }
            type='submit'
            variant='outline'
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default Add;
