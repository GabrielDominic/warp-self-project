"use client";

import {useCallback, useEffect, useState} from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { callbackify } from 'util';
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isloading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status == 'authenticated') {
            router.push('/users');
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if ( variant === 'LOGIN'){
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState:{
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant == 'REGISTER'){
            //AXIOS REGISTER
            axios.post('/api/register', data)
            .then(() => signIn('credentials', data))
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setIsLoading(false))
        }

        if (variant == 'LOGIN'){
            //NEXT Auth Sign in
            signIn('credentials', {
                ...data,
                redirect: false
            })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials');
                }
                if (callback?.ok && !callback?.error){
                    toast.success('Logged in!');
                    router.push('/users');
                }
            })
            .finally(() => setIsLoading(false));
        }
    }

    const SocialAction = (action: string) => {
        setIsLoading(true);
        //NextAuth Social Sign in
        signIn(action, {redirect: false})
        .then((callback) => {
            if (callback?.error) {
                toast.error('Invalid credentials');
            }
            if (callback?.ok && !callback?.error){
                toast.success('Logged in!')
            }
        })
        .finally(() => setIsLoading(false))
    }

    return (
        <div className='mt-8 sm:mx-auto sm:w-   full sm:max-w-md'>
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form className='space-y-6'
                onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === 'REGISTER' && (
                        <Input id="name" label='Name' register={register} errors={errors}/>
                    )}
                    <Input id="email" label='Email Address' type='email' register={register} errors={errors} disabled={isloading}/>
                    <Input id="password" label='Password' type='password' register={register} errors={errors} disabled={isloading}/>
                    <div>
                        <Button disabled={isloading}
                        fullwidth
                        type='submit'
                        >
                            {variant === 'LOGIN' ? 'Sign in': 'Register'}
                        </Button>
                    </div>
                </form>

                <div className='mt-6'>
                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='bg-white px-2 text-gray-500'>Or continue with</span>
                        </div>
                    </div>

                    <div className='mt-6 flex gap-2'>
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => SocialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => SocialAction('google')}
                        />
                    </div>

                    <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
                        <div>
                            {variant === 'LOGIN' ? 'New to Messenger?' : 'Already Have an Account?'}
                        </div>

                        <div onClick={toggleVariant} className='underline cursor-pointer'>
                            {variant === 'LOGIN' ? 'Create an Account' : 'Login'}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm;