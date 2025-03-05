import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import Exercicio from "../../../models/Exercicio"
import { buscar, deletar } from "../../../services/Service"
import { RotatingLines } from "react-loader-spinner"
import CardExercicio from "../cardexercicio/CardExercicio"

function DeletarExercicio() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [exercicio, setExercicio] = useState<Exercicio>({} as Exercicio)

    const { id } = useParams<{ id: string }>()
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    async function buscarPorId(id: string) {
        try {
            await buscar(`/exercicios/${id}`, setExercicio, {
                headers: {
                    'Authorization': token
                }
            })
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado')
            navigate('/')
        }
    }, [token])

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id)
        }
    }, [id])

    async function deletarExercicio() {
        setIsLoading(true)
        try {
            await deletar(`/exercicios/${id}`, {
                headers: {
                    'Authorization': token
                }
            })
            alert('Exercício apagado com sucesso')
        } catch (error: any) {
            if (error.toString().includes('403')) {
                handleLogout()
            } else {
                alert('Erro ao deletar o exercício.')
            }
        }
        setIsLoading(false)
        retornar()
    }

    function retornar() {
        navigate("/exercicios")
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <section
                className="text-center py-52 bg-cover bg-center"
                style={{ backgroundImage: `url('/images/exercicio_topo.png')` }}            >
                <h2 className="text-5xl font-bold text-white mb-4 brightness-70">DELETAR EXERCÍCIO</h2>
            </section>

            <div className="flex justify-center w-full bg-[#CEF9A9] p-4">
                <div className="container w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <p className="text-center font-semibold mb-4">
                        Você tem certeza de que deseja apagar o exercício a seguir?
                    </p>

                    {exercicio && (
                        <CardExercicio
                            exercicio={exercicio}
                            onDelete={deletarExercicio} 
                            showActions={false}  // Aqui não vamos exibir os botões
                        />
                    )}

                    {/* Botões de ação */}
                    <div className="flex gap-4 mt-6">
                        <button
                            className="w-full text-slate-100 bg-gray-400 hover:bg-gray-600 py-2 rounded-lg"
                            onClick={retornar}
                        >
                            Não
                        </button>
                        <button
                            className="w-full text-slate-100 bg-red-600 hover:bg-red-800 py-2 rounded-lg flex items-center justify-center"
                            onClick={deletarExercicio}
                        >
                            {isLoading ? (
                                <RotatingLines
                                    strokeColor="white"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="24"
                                    visible={true}
                                />
                            ) : (
                                <span>Sim</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeletarExercicio
