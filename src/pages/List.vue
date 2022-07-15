<script lang="ts" setup>
import { useObservable } from '@vueuse/rxjs'
import AddIcon from '@/components/icons/AddIcon.vue'
import RubbishIcon from '@/components/icons/RubbishIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { formatRelativeTime } from '@/lib/relative-time'
import { addQuiz, deleteQuiz, getQuizzes$, getPlayers$, addPlayer } from '@/lib/store/client'
import { PlayerEntry, type QuizEntry } from '@/lib/store/db'
import { LinkTable, LinkTableColumn } from '@/components/table'
import randomColor from 'randomcolor'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'
import { tap } from 'rxjs'

const quizzes = useObservable<QuizEntry[]>(getQuizzes$())

const players = useObservable<PlayerEntry[]>(getPlayers$().pipe(tap(console.log)))

async function createQuiz() {
  await addQuiz()
}

async function createPlayer() {
  await addPlayer({ name: 'New Player', backgroundColor: randomColor({ luminosity: 'bright' }) })
}

async function remove(id: string) {
  await deleteQuiz(id)
}
</script>

<template>
  <CreateLayout title="Quizzes">
    <template #title>
      <h1 class="title">Quizzing 🥷</h1>
    </template>
    <template #action>
      <button @click="createQuiz" class="add-button"><AddIcon /> Create quiz</button>
    </template>

    <div class="page">
      <section>
        <h3 class="section-title">Quizzes</h3>
        <p class="help">
          A quiz is a set of questions. To start a round, select a quiz from below and click the
          play button.
        </p>
        <LinkTable :data="quizzes" class="table" :row-link="({ id }) => `/create/${id}`">
          <LinkTableColumn title="Name" #default="{ name }: QuizEntry">{{ name }}</LinkTableColumn>
          <LinkTableColumn title="Questions" #default="{ questions }: QuizEntry">
            {{ questions?.length ?? 0 }}
          </LinkTableColumn>
          <LinkTableColumn title="Created" #default="{ createdAt }: QuizEntry">
            {{ formatRelativeTime(createdAt!) }}
          </LinkTableColumn>
          <LinkTableColumn title="Updated" #default="{ updatedAt }: QuizEntry">
            {{ formatRelativeTime(updatedAt!) }}
          </LinkTableColumn>
          <LinkTableColumn title="" #default="{ id, name }: QuizEntry">
            <button
              class="delete-button"
              @click.prevent="remove(id!)"
              :aria-label="`Delete ${name}`"
            >
              <RubbishIcon />
            </button>
          </LinkTableColumn>
          <template #empty>
            <p>No quizzes yet. Create one?</p>
          </template>
        </LinkTable>
      </section>

      <section>
        <h3 class="section-title">Players <button @click="createPlayer">+</button></h3>
        <p class="help">
          Add players to keep score while running the quiz. You can choose who is taking part when
          starting the round.
        </p>
        <div class="players">
          <ul class="player-list">
            <li v-for="player in players" :key="player.id">
              <PlayerAvatar :player="player" />
            </li>
          </ul>
        </div>
      </section>
    </div>
  </CreateLayout>
</template>

<style lang="scss" scoped>
.table {
  --column-spans: repeat(4, 2fr) 1fr;
  margin-top: 2rem;
}

.title {
  display: inline-block;
  margin: 0 auto 0 0;
  font-size: var(--create-header-font-size);
  font-weight: normal;
}

.section-title {
  margin: 0 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.page {
  display: grid;
  margin: 1rem 2rem 0;
  margin-top: 3rem;
  grid-gap: 2rem;
  grid-template-columns: 2fr 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.players {
  padding: 0.5rem;
  background-color: var(--background1);
  border-radius: 10px;
}

.player-list {
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  gap: 1.5rem;
}

.help {
  margin: 1rem 1.5rem;
  color: rgba(255 255 255 / 70%);
  font-size: 0.875rem;
  font-weight: normal;
}

.add-button {
  --background-alpha: 5%;
  --foreground-alpha: 60%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #ef476f;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  &:active {
    transform: scale(0.95);
  }

  svg {
    margin-right: 0.5rem;
    color: rgb(255 255 255 / var(--foreground-alpha));
  }
}

.delete-button {
  --background-alpha: 0%;
  --foreground-alpha: 20%;
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / var(--background-alpha));
  border-radius: 50%;
  color: rgb(255 255 255 / var(--foreground-alpha));
  cursor: pointer;
  transition: 0.25s ease;
  transition-property: color, background-color, transform;

  .item:hover & {
    --background-alpha: 10%;
    --foreground-alpha: 30%;

    &:hover {
      --background-alpha: 20%;
      --foreground-alpha: 50%;
    }

    &:active {
      --background-alpha: 10%;
      --foreground-alpha: 30%;
      transform: scale(0.95);
    }
  }
}
</style>
