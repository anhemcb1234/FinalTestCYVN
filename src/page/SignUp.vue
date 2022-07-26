<template>
  <div class="font-sans min-h-screen antialiased bg-gray-900 pt-24 pb-5">
    <div class="flex flex-col justify-center sm:w-96 sm:m-auto mx-5 mb-5 space-y-8">
        <h1 class="font-bold text-center text-4xl text-yellow-500">Chat<span class="text-blue-500">App</span></h1>
        <form @submit.prevent="onFormSubmit">
            <div class="flex flex-col bg-white p-10 rounded-lg shadow space-y-6">
                <h1 class="font-bold text-xl text-center">Đăng kí</h1>

                <div class="flex flex-col space-y-1">
                    <input v-model="dataUser.username" type="text" name="username" id="username" class="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow" placeholder="Email" />
                </div>

                <div class="flex flex-col space-y-1">
                    <input v-model="dataUser.password" type="password" name="password" id="password" class="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow" placeholder="Mật khẩu" />
                </div>
                <div class="flex flex-col-reverse sm:flex-row sm:justify-between items-center">
                    <router-link to="/" class="inline-block text-blue-500 hover:text-blue-800 hover:underline">
                        Đăng nhập?
                    </router-link>
                    <button type="submit" class="bg-blue-500 text-white font-bold px-5 py-2 rounded focus:outline-none shadow hover:bg-blue-700 transition-colors">Đăng kí</button>
                </div>
            </div>
        </form>
        <div class="flex justify-center text-gray-500 text-sm">
            <p>&copy;2022. All right reserved.</p>
        </div>
    </div>
</div>
</template>

<script>
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from "@/firebase";
import {collection, getDocs, deleteDoc, doc, onSnapshot, addDoc, query, where} from 'firebase/firestore';
import {db} from '@/firebase';

export default {
  name: "Signup",
  data() {
    return {
      dataUser: {
                username: "",
                password: "",
            }
    };
  },
  methods: {
    async onFormSubmit() {
      try {
        const response = await createUserWithEmailAndPassword(auth, this.dataUser.username, this.dataUser.password);
        // const collectionRef = collection(db, 'users');
        // await addDoc(collectionRef, {
        //   email: response.user.email,
        //   userId: response.user.uid,
        // });
        alert('Đăng kí thành công');
      } catch (error) {
        alert(error.message)
        console.log(error.message);
      }
    },
  },
}
</script>

<style scoped>

</style>